const fs = require('fs');
const path = 'c:\\Users\\ivanb\\OneDrive\\Desktop\\edp\\employee-dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix Step 1 (should have 5 divs, currently has 5 in some versions or 4)
// Let's just normalize the whole thing.

// Fix Step 3 (remove one extra div)
// Current end of Step 3:
//                   </div>
//                 </div>
//               )}
// Wait, I need to find the specific blocks.

// Step 3 end fix:
content = content.replace(
    /(additionalSkills[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>\s*<\/div>\s*\)\}/,
    '$1)}'
);

// Step 4 end fix (remove two extra divs)
content = content.replace(
    /(applicantPhone[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/,
    '$1)}'
);

// Step 6 end fix (remove three extra divs)
content = content.replace(
    /(approvedAsstManager[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/,
    '$1)}'
);

// Fix the very end (balance the form and modal)
// We already did some of this, but let's be sure.

fs.writeFileSync(path, content);
console.log('Tags fixed');
