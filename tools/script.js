document.addEventListener("DOMContentLoaded", function () {
    const codeContainer = document.getElementById("code");
    const runButton = document.getElementById("run-button");
    const outputIframe = document.getElementById("output-iframe");
    const themeToggle = document.getElementById("theme-toggle");
    const title = document.getElementById("title"); // Added reference to the title element
   
    // Initialize CodeMirror with the default theme
    let editor = CodeMirror(codeContainer, {
        mode: "javascript",
        lineNumbers: true,
        theme:"elegant",
    });

    // Command History
    const commandHistory = JSON.parse(localStorage.getItem("commandHistory")) || [];
    let historyIndex = commandHistory.length - 1;

    // Function to execute code in the iframe
    function executeCode() {
        var code = editor.getValue(); // Get the code from the editor
        const iframeDocument = outputIframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(`
            <html>
            <head>
                <title>Code Runner</title>
            </head>
            <body>
                <div id="output"></div>
                <script>
                    window.onerror = function (message, source, lineno, colno, error) {
                        lineno = lineno - 7; // Subtract 7 from line number
                        const errorMessage = 'Error: ' + message + ' (Line: ' + lineno + ', Column: ' + colno + ')';
                        document.getElementById('output').innerHTML = '<pre style="color: red;">' + errorMessage + '</pre>';
                        return true;
                    };
                    ${code}
                </script>
            </body>
            </html>
        `);
        iframeDocument.close();
        // Add the executed command to the history
        addToCommandHistory(code);
    }

    runButton.addEventListener("click", executeCode);

    // Function to handle Shift + Enter key press
    function handleShiftEnterKey(event) {
        if (event.shiftKey && event.key === "Enter") {
            // Prevent the default behavior of the Enter key (line break)
            event.preventDefault();
            // Simulate a click on the "Run" button
            runButton.click();
        }
    }

    // Add event listener for Shift + Enter key press
    document.addEventListener("keydown", handleShiftEnterKey);

    // Function to toggle theme
    function toggleTheme() {
        if (document.body.classList.contains("dark-theme")) {
            // Switch to the light theme
            themeIcon.innerText = '🌞'; 
            document.body.classList.remove("dark-theme");
            // Update the title for the light theme
            // Configure CodeMirror with the "default" theme
            editor.setOption("theme","default");
        } else {
            // Switch to the dark theme
            themeIcon.innerText = '🌙'; 
            document.body.classList.add("dark-theme");
            // Update the title for the dark theme
            // Configure CodeMirror with the "material-dark" theme
            editor.setOption("theme","material-darker");
        }
    }

    // Add event listener for theme toggle button
    themeToggle.addEventListener("click", toggleTheme);

        // Function to add a command to the history
        function addToCommandHistory(command) {
            if (command) {
                commandHistory.push(command);
                localStorage.setItem("commandHistory", JSON.stringify(commandHistory));
                historyIndex = commandHistory.length - 1;
            }
        }
    
        // Function to navigate the command history
        function navigateCommandHistory(direction) {
            const newIndex = historyIndex + direction;
            if (newIndex >= 0 && newIndex < commandHistory.length) {
                historyIndex = newIndex;
                editor.setValue(commandHistory[historyIndex]);
                editor.setCursor(editor.lineCount()); // Move cursor to the end of the code
            }
        }
    
        // Add event listener for Shift + Up and Shift + Down keys to navigate command history
        document.addEventListener("keydown", function (event) {
            if (event.shiftKey && event.key === "ArrowUp") {
                navigateCommandHistory(-1); // Navigate to previous command
            } else if (event.shiftKey && event.key === "ArrowDown") {
                navigateCommandHistory(1); // Navigate to next command
            }
        });

        function clearCommandHistory() {
            commandHistory.length = 0; // Clear the history array
            localStorage.removeItem("commandHistory"); // Remove the history from local storage
            historyIndex = -1; // Reset the history index
            editor.setValue(""); // Clear the code editor
        }
    
        // Add event listener for the "Clear History" button
        const clearHistoryButton = document.getElementById("bin-toggle");
        clearHistoryButton.addEventListener("click", clearCommandHistory);

});

