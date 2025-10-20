const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');

console.log('Reading ChatSidebar.jsx...');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the extra closing div on line 300
// The pattern is: three closing divs in a row before the )}
// We want to keep only two closing divs
const oldPattern = `              </button>
            </div>
          </div>
        </div>
      )}`;

const newPattern = `              </button>
            </div>
        </div>
      )}`;

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed extra closing div in ChatSidebar.jsx');
} else {
  console.log('❌ Pattern not found - file may already be fixed or has changed');
}
