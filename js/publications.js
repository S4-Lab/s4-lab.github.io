// Parse YAML frontmatter and markdown body from a .md file string
function parseMarkdownFile(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const frontmatter = parseYAML(match[1]);
    frontmatter._body = match[2].trim();
    return frontmatter;
}

// Minimal YAML parser supporting strings, arrays of objects, and arrays of strings
function parseYAML(text) {
    const result = {};
    const lines = text.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const keyMatch = line.match(/^(\w+):\s*(.*)/);
        if (!keyMatch) { i++; continue; }

        const key = keyMatch[1];
        const rest = keyMatch[2].trim();

        if (rest === '') {
            // Block value: array of items
            const items = [];
            i++;
            while (i < lines.length && lines[i].match(/^  - /)) {
                const itemLine = lines[i].replace(/^  - /, '').trim();
                if (itemLine.includes(': ')) {
                    // Object item — collect all properties
                    const obj = {};
                    const firstProp = itemLine.match(/^(\w+):\s*(.*)/);
                    if (firstProp) obj[firstProp[1]] = firstProp[2].replace(/^["']|["']$/g, '');
                    i++;
                    while (i < lines.length && lines[i].match(/^    \w+:/)) {
                        const propMatch = lines[i].trim().match(/^(\w+):\s*(.*)/);
                        if (propMatch) obj[propMatch[1]] = propMatch[2].replace(/^["']|["']$/g, '');
                        i++;
                    }
                    items.push(obj);
                } else {
                    items.push(itemLine.replace(/^["']|["']$/g, ''));
                    i++;
                }
            }
            result[key] = items;
        } else {
            result[key] = rest.replace(/^["']|["']$/g, '');
            i++;
        }
    }
    return result;
}

// Convert minimal markdown to HTML (bold, italic, lists, paragraphs)
function markdownToHTML(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('- ')) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${inlineMD(line.slice(2))}</li>`;
        } else {
            if (inList) { html += '</ul>'; inList = false; }
            if (line.trim() !== '') {
                html += `<p>${inlineMD(line)}</p>`;
            }
        }
    }
    if (inList) html += '</ul>';
    return html;
}

function inlineMD(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// Extract a named section (## Heading) from the markdown body
function extractSection(body, heading) {
    const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = body.match(regex);
    return match ? match[1].trim() : '';
}

// Publications are grouped by year, then by type within each year
const TYPE_GROUPS = [
    { key: 'paper', label: 'Journal & Conference Papers', types: ['journal', 'conference'] },
    { key: 'demo', label: 'Demos', types: ['demo'] },
    { key: 'workshop', label: 'Workshop Papers', types: ['workshop'] },
    { key: 'patent', label: 'Patents', types: ['patent'] }
];

let allPublications = [];
let activeYear = 'all';
let activeType = 'all';

async function loadPublications() {
    try {
        // One token per load, so edits to any .md file are never served stale
        const cacheBust = Date.now();
        const indexRes = await fetch('data/publications/index.json?v=' + cacheBust);
        const filenames = await indexRes.json();

        allPublications = (await Promise.all(filenames.map(async (filename) => {
            const res = await fetch(`data/publications/${filename}?v=${cacheBust}`);
            const text = await res.text();
            const parsed = parseMarkdownFile(text);
            if (parsed) parsed._slug = filename.replace(/\.md$/, '');
            return parsed;
        }))).filter(Boolean);

        initFilters();
        render();
        scrollToHashTarget();

    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

// Anything without a recognised type is shown with the journal/conference papers
function normalizeType(type) {
    const t = (type || '').toLowerCase();
    return TYPE_GROUPS.some(g => g.types.includes(t)) ? t : 'journal';
}

function groupKeyFor(pub) {
    const t = normalizeType(pub.type);
    return (TYPE_GROUPS.find(g => g.types.includes(t)) || TYPE_GROUPS[0]).key;
}

function matchesFilters(pub) {
    const year = String(pub.year || '');
    const yearMatch = activeYear === 'all'
        || (activeYear === 'older' ? parseInt(year) < 2022 : year === activeYear);
    const typeMatch = activeType === 'all' || groupKeyFor(pub) === activeType;
    return yearMatch && typeMatch;
}

function render() {
    const container = document.getElementById('publications-container');
    if (!container) return;
    container.innerHTML = '';

    const visible = allPublications.filter(matchesFilters);

    if (visible.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-results';
        empty.textContent = 'No publications match these filters.';
        container.appendChild(empty);
        return;
    }

    const byYear = {};
    visible.forEach(pub => {
        const yr = pub.year || 'Unknown';
        (byYear[yr] = byYear[yr] || []).push(pub);
    });

    const years = Object.keys(byYear).sort((a, b) => b - a);

    years.forEach(year => {
        const yearGroup = document.createElement('div');
        yearGroup.className = 'year-group';
        yearGroup.setAttribute('data-year', year);

        const yearTitle = document.createElement('h2');
        yearTitle.className = 'year-title';
        yearTitle.textContent = year;
        yearGroup.appendChild(yearTitle);

        TYPE_GROUPS.forEach(group => {
            const items = byYear[year].filter(p => group.types.includes(normalizeType(p.type)));
            if (items.length === 0) return;

            const typeTitle = document.createElement('h3');
            typeTitle.className = 'type-title';
            typeTitle.textContent = group.label;
            yearGroup.appendChild(typeTitle);

            items.forEach(pub => yearGroup.appendChild(createPublicationElement(pub)));
        });

        container.appendChild(yearGroup);
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const typeBtns = document.querySelectorAll('.type-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeYear = btn.getAttribute('data-filter');
            render();
        });
    });

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeType = btn.getAttribute('data-type');
            render();
        });
    });
}

// Scroll to and briefly highlight a specific publication when linked to via #slug
function scrollToHashTarget() {
    const slug = window.location.hash.replace('#', '');
    if (!slug) return;
    const el = document.getElementById(slug);
    if (!el) return;
    setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pub-highlight');
        setTimeout(() => el.classList.remove('pub-highlight'), 2200);
    }, 150);
}

function createPublicationElement(pub) {
    const pubDiv = document.createElement('div');
    pubDiv.className = 'publication-item-enhanced';
    pubDiv.setAttribute('data-category', pub.category || '');
    pubDiv.setAttribute('data-year', pub.year || '');
    if (pub._slug) pubDiv.id = pub._slug;
    pubDiv.style.display = 'flex';
    pubDiv.style.flexDirection = 'row';
    pubDiv.style.alignItems = 'flex-start';
    pubDiv.style.gap = '1.5rem';
    pubDiv.style.marginBottom = '2rem';
    pubDiv.style.paddingBottom = '2rem';
    pubDiv.style.borderBottom = '1px solid #e8e8e8';

    // Image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'pub-image';
    imageDiv.style.flexShrink = '0';
    imageDiv.style.width = '240px';
    const img = document.createElement('img');
    img.src = pub.image || `https://via.placeholder.com/240x192/8C1515/ffffff?text=Fig`;
    img.alt = 'Publication Figure';
    img.style.width = '240px';
    img.style.height = '192px';
    img.style.objectFit = 'contain';
    img.style.background = '#ffffff';
    img.style.borderRadius = '6px';
    img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    img.style.display = 'block';
    imageDiv.appendChild(img);

    // Main content
    const mainContent = document.createElement('div');
    mainContent.className = 'pub-main-content';

    // Header
    const header = document.createElement('div');
    header.className = 'pub-header';

    const title = document.createElement('h4');
    title.textContent = pub.title;
    header.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'pub-meta';

    const authorsEl = document.createElement('p');
    authorsEl.className = 'pub-authors';
    const authors = Array.isArray(pub.authors) ? pub.authors : [];
    authorsEl.innerHTML = authors.map(a => {
        const sup = a.note ? `<sup>${a.note}</sup>` : '';
        return `${a.name}${sup}`;
    }).join(', ');
    meta.appendChild(authorsEl);

    const journalEl = document.createElement('p');
    journalEl.className = 'pub-journal';
    journalEl.innerHTML = `<em>${pub.journal || ''}</em>${pub.volume ? ', ' + pub.volume : ''}${pub.pages ? ', ' + pub.pages : ''} (${pub.year_published || pub.year || ''})`;
    meta.appendChild(journalEl);

    header.appendChild(meta);
    mainContent.appendChild(header);

    // Badges
    const badges = Array.isArray(pub.badges) ? pub.badges : [];
    if (badges.length > 0) {
        const badgesDiv = document.createElement('div');
        badgesDiv.className = 'pub-badges';
        badges.forEach(b => {
            const span = document.createElement('span');
            span.className = `badge badge-${b.type}`;
            span.textContent = b.text;
            badgesDiv.appendChild(span);
        });
        mainContent.appendChild(badgesDiv);
    }

    // Links
    const links = Array.isArray(pub.links) ? pub.links : [];
    if (links.length > 0) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'pub-links';
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url || '#';
            a.className = 'pub-link';
            a.innerHTML = `<span class="link-icon">${link.icon}</span> ${link.text}`;
            linksDiv.appendChild(a);
        });
        mainContent.appendChild(linksDiv);
    }

    // Abstract expandable
    const abstractText = extractSection(pub._body || '', 'Abstract');
    if (abstractText) {
        mainContent.appendChild(createExpandableSection('Abstract', markdownToHTML(abstractText)));
    }

    pubDiv.appendChild(imageDiv);
    pubDiv.appendChild(mainContent);
    return pubDiv;
}

function createExpandableSection(label, htmlContent) {
    const wrapper = document.createElement('div');
    wrapper.className = 'pub-expandable';

    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.innerHTML = `<span class="expand-icon">▶</span> ${label}`;

    const content = document.createElement('div');
    content.className = 'expandable-content';
    content.style.display = 'none';
    content.innerHTML = htmlContent;

    btn.onclick = function () {
        const open = content.style.display !== 'none';
        content.style.display = open ? 'none' : 'block';
        btn.querySelector('.expand-icon').textContent = open ? '▶' : '▼';
    };

    wrapper.appendChild(btn);
    wrapper.appendChild(content);
    return wrapper;
}

document.addEventListener('DOMContentLoaded', loadPublications);
