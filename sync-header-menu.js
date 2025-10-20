const fs = require('fs');
const path = require('path');

console.log('Syncing menu and locations from wfm-header.html...\n');

const filePath = path.join(__dirname, 'squarespace-header-fixed.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the entire navigation section to match wfm-header.html structure
const oldNav = `<div class="nav-wrap">
                <nav class="nav-menu" id="navMenu">
                    <div class="dropdown">
                        <button class="dropdown-title">
                            <span>📍</span>
                            Locations
                        </button>
                        <div class="dropdown-content locations-dropdown">
                            <div class="locations-section">
                                <div class="locations-section-header">
                                    <span>🏛️</span>
                                    <span>Ohio</span>
                                </div>
                                <div class="locations-grid">
                                    <a href="/youngstown">Youngstown</a>
                                    <a href="/cleveland">Cleveland</a>
                                    <a href="/warren">Warren</a>
                                    <a href="/akron-canton">Akron-Canton</a>
                                    <a href="/north-jackson">North Jackson</a>
                                    <a href="/avon">Avon</a>
                                    <a href="/ashtabula">Ashtabula</a>
                                    <a href="/boardman">Boardman</a>
                                </div>
                            </div>
                            <div class="locations-divider"></div>
                            <div class="locations-section">
                                <div class="locations-section-header">
                                    <span>🏔️</span>
                                    <span>Pennsylvania</span>
                                </div>
                                <div class="locations-grid">
                                    <a href="/pittsburgh">Pittsburgh</a>
                                    <a href="/erie">Erie</a>
                                    <a href="/butler">Butler</a>
                                    <a href="/cranberry">Cranberry</a>
                                    <a href="/hermitage">Hermitage</a>
                                    <a href="/monroeville">Monroeville</a>
                                </div>
                            </div>
                            <div class="view-all-locations">
                                <a href="/locations">🗺️ View All Service Areas</a>
                            </div>
                        </div>
                    </div>
                    <a href="/services" class="nav-link">
                        <span>💪</span>
                        Services
                    </a>
                    <a href="/reviews" class="nav-link">
                        <span>⭐</span>
                        Leave a Review
                    </a>
                    <a href="/longdistance" class="nav-link">
                        <span>🚚</span>
                        Long Distance
                    </a>
                    <a href="/movingsupplies" class="nav-link">
                        <span>📦</span>
                        Supplies
                    </a>
                    <a href="/contact-us" class="nav-link">
                        <span>💬</span>
                        Contact
                    </a>
                    <div class="dropdown">
                        <button class="dropdown-title">
                            <span>💡</span>
                            More
                        </button>
                        <div class="dropdown-content">
                            <a href="/customerdocuments">Customer Rights</a>
                            <a href="/terms-of-service">Terms of Service</a>
                            <a href="/movingprep">Moving Tips</a>
                            <a href="/our-partners">Partners</a>
                            <a href="/apply">Career</a>
                        </div>
                    </div>
                </nav>
            </div>`;

const newNav = `<div class="nav-wrap">
                <nav class="nav-menu" id="navMenu">
                    <div class="dropdown">
                        <button class="dropdown-title">
                            <span class="nav-icon">📍</span>
                            Locations
                        </button>
                        <div class="dropdown-content locations-dropdown">
                            <a href="/akron-canton">Akron-Canton, OH</a>
                            <a href="/cleveland">Cleveland, OH</a>
                            <a href="/north-jackson">North Jackson, OH</a>
                            <a href="/warren">Warren, OH</a>
                            <a href="/youngstown">Youngstown, OH</a>
                            <a href="/butler">Butler, PA</a>
                            <a href="/pittsburgh">Pittsburgh, PA</a>
                            <a href="/erie">Erie, PA</a>
                            <a href="/avon">Avon, OH</a>
                            <a href="/ashtabula">Ashtabula, OH</a>
                        </div>
                    </div>
                    <a href="/movingsupplies" class="nav-link">
                        <span class="nav-icon">📦</span>
                        Moving Supplies
                    </a>
                    <a href="/reviews" class="nav-link">
                        <span class="nav-icon">⭐</span>
                        Reviews
                    </a>
                    <a href="/longdistance" class="nav-link">
                        <span class="nav-icon">🚚</span>
                        Long Distance
                    </a>
                    <a href="/ourblog" class="nav-link">
                        <span class="nav-icon">📝</span>
                        Blog
                    </a>
                    <a href="/contact-us" class="nav-link">
                        <span class="nav-icon">💬</span>
                        Contact
                    </a>
                    <div class="dropdown">
                        <button class="dropdown-title">
                            <span class="nav-icon">💡</span>
                            More
                        </button>
                        <div class="dropdown-content">
                            <a href="/customerdocuments">Customer Rights</a>
                            <a href="/movingprep">Moving Tips</a>
                            <a href="/our-partners">Partners</a>
                            <a href="/apply">Career</a>
                        </div>
                    </div>
                </nav>
            </div>`;

content = content.replace(oldNav, newNav);

// Update the locations dropdown CSS to match wfm-header.html
const oldLocationsCSS = `.locations-section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 10px;
            padding: 8px 12px;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05));
            border-radius: 8px;
            border-left: 4px solid var(--primary-blue);
        }

        .locations-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            margin-bottom: 15px;
        }

        .locations-dropdown a {
            font-size: 13px;
            padding: 8px 12px;
        }

        .locations-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 10px 0;
        }

        .view-all-locations {
            text-align: center;
            padding: 8px 0;
            border-top: 1px solid #e2e8f0;
            margin-top: 10px;
        }

        .view-all-locations a {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple));
            color: white !important;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            transform: none !important;
        }`;

const newLocationsCSS = `.locations-dropdown {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            min-width: 460px;
            gap: 5px;
        }

        .nav-icon {
            font-size: 18px;
            transition: transform 0.3s ease;
        }`;

content = content.replace(oldLocationsCSS, newLocationsCSS);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Synced menu structure!');
console.log('   - Updated locations to match wfm-header.html');
console.log('   - Changed "Supplies" → "Moving Supplies"');
console.log('   - Changed "Leave a Review" → "Reviews"');
console.log('   - Changed "Services" → removed');
console.log('   - Added "Blog" link');
console.log('   - Removed "Terms of Service" from More');
console.log('   - Updated locations dropdown to simple 2-column layout');
console.log('\n📁 Updated: squarespace-header-fixed.html');
