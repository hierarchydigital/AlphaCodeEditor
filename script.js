const htmlEditor = document.getElementById('html');
const cssEditor = document.getElementById('css');
const jsEditor = document.getElementById('js');
const output = document.getElementById('output');
const modeToggle = document.getElementById("modeToggle");
let history = { html: [], css: [], js: [] };
let historyIndex = { html: -1, css: -1, js: -1 };
let isDarkMode = true;

function updateOutput() {
    const html = htmlEditor.value;
    const css = `<style>${cssEditor.value}</style>`;
    const js = `<script>${jsEditor.value}<\/script>`;
    const finalCode = `${html} ${css} ${js}`;

    const doc = output.contentDocument || output.contentWindow.document;
    doc.open();
    doc.write(finalCode);
    doc.close();
}

function saveHistory(type) {
    if (history[type].length > 50) history[type].shift();
    history[type].push(document.getElementById(type).value);
    historyIndex[type]++;
}

function undo() {
    ["html", "css", "js"].forEach(type => {
        if (historyIndex[type] > 0) {
            historyIndex[type]--;
            document.getElementById(type).value = history[type][historyIndex[type]];
            updateOutput();
        }
    });
}

function redo() {
    ["html", "css", "js"].forEach(type => {
        if (historyIndex[type] < history[type].length - 1) {
            historyIndex[type]++;
            document.getElementById(type).value = history[type][historyIndex[type]];
            updateOutput();
        }
    });
}

function clearAll() {
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    updateOutput();
}

function saveFiles() {
    saveFile('index.html', htmlEditor.value);
    saveFile('style.css', cssEditor.value);
    saveFile('script.js', jsEditor.value);
    alert('Files saved successfully!');
}

function saveFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function toggleMode() {
    document.body.classList.toggle("light-mode");
    modeToggle.classList.toggle("active");
    isDarkMode = !isDarkMode;
}

function initializeEditor() {
    ['html', 'css', 'js'].forEach(type => {
        document.getElementById(type).addEventListener('input', () => {
            saveHistory(type);
            updateOutput();
        });
        saveHistory(type);
    });
    updateOutput();
}

initializeEditor();
document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items
    const menuItems = document.querySelectorAll('.menu-item');

    // Add event listeners to each menu item for dropdown toggle
    menuItems.forEach(menuItem => {
        menuItem.addEventListener('mouseenter', () => {
            const dropdown = menuItem.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = 'block'; // Show dropdown on hover
            }
        });

        menuItem.addEventListener('mouseleave', () => {
            const dropdown = menuItem.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = 'none'; // Hide dropdown when not hovering
            }
        });
    });
});

// Example functions for dropdown items
function showSidePanel() {
    console.log("Side Panel Shown");
    // Add your logic to show the side panel here
}

function halfView() {
    console.log("Half View Activated");
    // Add your logic for half view here
}

function closeView() {
    console.log("View Closed");
    // Add your logic to close the view here
}
// Function to handle creating a new project
function newProject() {
    const userChoice = confirm("Would you like to upload individual files or start a new project?");
    
    if (userChoice) {
        // User wants to upload files
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true; // Allow multiple file uploads
        input.accept = '.html,.css,.js'; // Accept specific file types
        
        input.onchange = (event) => {
            const files = event.target.files;

            // Check if any files were uploaded
            if (files.length === 0) {
                alert("No files selected.");
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const content = e.target.result;

                    // Allocate each file to the respective code box based on file extension
                    if (file.name.endsWith('.html')) {
                        document.querySelector('textarea.html').value = content;
                    } else if (file.name.endsWith('.css')) {
                        document.querySelector('textarea.css').value = content;
                    } else if (file.name.endsWith('.js')) {
                        document.querySelector('textarea.js').value = content;
                    }
                };

                reader.readAsText(file); // Read the content of the file
            }
        };

        input.click(); // Trigger file selection dialog
    } else {
        // Reload the page to start a new project
        location.reload();
    }
}

// Function to handle saving files
function saveAs() {
    // Create Blob for each file type and trigger download
    const htmlContent = document.querySelector('textarea.html').value;
    const cssContent = document.querySelector('textarea.css').value;
    const jsContent = document.querySelector('textarea.js').value;

    // Create and trigger download for HTML file
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    htmlLink.click();

    // Create and trigger download for CSS file
    const cssBlob = new Blob([cssContent], { type: 'text/css' });
    const cssUrl = URL.createObjectURL(cssBlob);
    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = 'style.css';
    cssLink.click();

    // Create and trigger download for JS file
    const jsBlob = new Blob([jsContent], { type: 'application/javascript' });
    const jsUrl = URL.createObjectURL(jsBlob);
    const jsLink = document.createElement('a');
    jsLink.href = jsUrl;
    jsLink.download = 'script.js';
    jsLink.click();
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const toggleThemeButton = document.getElementById('toggle-theme');
    const body = document.body;
    const logo = document.getElementById('logo');

    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        logo.src = "images/white2.png"; // Dark mode logo
    }

    toggleThemeButton.addEventListener('click', function() {
        // Toggle dark mode
        body.classList.toggle('dark-mode');

        // Change logo based on the current theme
        if (body.classList.contains("dark-mode")) {
            logo.src = "images/white2.png"; // Dark mode logo
            localStorage.setItem('theme', 'dark'); // Save user preference
        } else {
            logo.src = "images/logo.png"; // Light mode logo
            localStorage.removeItem('theme'); // Remove user preference
        }
    });
});
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const toggleThemeButton = document.getElementById('toggle-theme');
    const viewToggle = document.getElementById('view-toggle');
    const body = document.body;
    const logo = document.getElementById('logo');

    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        logo.src = "images/white2.png"; // Dark mode logo
    }

    toggleThemeButton.addEventListener('click', function() {
        // Toggle dark mode
        body.classList.toggle('dark-mode');

        // Change logo based on the current theme
        if (body.classList.contains("dark-mode")) {
            logo.src = "images/white2.png"; // Dark mode logo
            localStorage.setItem('theme', 'dark'); // Save user preference
        } else {
            logo.src = "images/logo.png"; // Light mode logo
            localStorage.removeItem('theme'); // Remove user preference
        }
    });

    viewToggle.addEventListener('click', function() {
        // Toggle mobile view
        if (body.classList.contains('mobile-view')) {
            body.classList.remove('mobile-view');
            viewToggle.querySelector('.view-label').textContent = 'Mobile'; // Change label to Mobile
        } else {
            body.classList.add('mobile-view');
            viewToggle.querySelector('.view-label').textContent = 'Desktop'; // Change label to Desktop
        }
    });
});


 // Keyboard shortcuts
 document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') { // Ctrl + Enter to run
        runCode();
    } else if (event.ctrlKey && event.key === 's') { // Ctrl + S to save
        event.preventDefault(); // Prevent the default save dialog
        saveCode();
    } else if (event.ctrlKey && event.key === 'd') { // Ctrl + D to toggle theme
        toggleTheme();
    }
});
function adjustView() {
    const outputContainer = document.querySelector('.output-container');
    const editorContainer = document.querySelector('.editor-container');

    const width = window.innerWidth; // Get the current window width

    if (width >= 1024) { // PC view
        showSidePanel(); // Default to show side panel for PC
    } else if (width >= 768) { // Tablet view
        halfView(); // Default to half view for Tablet
    } else { // Mobile view
        closeView(); // Default to closed view for Mobile
    }
}

function showSidePanel() {
    const outputContainer = document.querySelector('.output-container');
    const editorContainer = document.querySelector('.editor-container');

    outputContainer.style.flex = '1 1 70%';  // Box 2 takes 70%
    editorContainer.style.flex = '1 1 30%';  // Box 1 takes 30%
}

function halfView() {
    const outputContainer = document.querySelector('.output-container');
    const editorContainer = document.querySelector('.editor-container');

    outputContainer.style.flex = '1 1 50%';  // Both boxes take 50%
    editorContainer.style.flex = '1 1 50%';
}

function closeView() {
    const outputContainer = document.querySelector('.output-container');
    const editorContainer = document.querySelector('.editor-container');

    outputContainer.style.flex = '1 1 8%';  // Both boxes take 50%
    editorContainer.style.flex = '1 1 40%';
}

// Call adjustView() on load and resize
window.addEventListener('load', adjustView);
window.addEventListener('resize', adjustView);

document.addEventListener("keydown", function(event) {
    const activeElement = document.activeElement;
    
    // Undo
    if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undo(); // Call your undo function
    }
    
    // Redo
    if (event.ctrlKey && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault();
        redo(); // Call your redo function
    }

    // Select All
    if (event.ctrlKey && event.key === "a") {
        event.preventDefault();
        activeElement.select();
    }

    // Copy, Cut, Paste
    if (event.ctrlKey && (event.key === "c" || event.key === "x" || event.key === "v")) {
        // Default copy/cut/paste works without additional code
    }

    // Comment / Uncomment
    if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        commentSelectedCode(activeElement); // Implement this function to toggle comments
    }

    // Save
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveFiles(); // Call your save function
    }

    // Toggle Dark/Light Mode
    if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        toggleDarkLightMode(); // Implement your mode toggle function
    }
});
