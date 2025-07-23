'use strict';

// Code copy functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add copy button to all code blocks
    const codeBlocks = document.querySelectorAll('pre > code');
    
    codeBlocks.forEach(function(codeBlock) {
        const pre = codeBlock.parentNode;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = '📋';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        copyButton.setAttribute('title', 'Copy code');
        
        // Create wrapper for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // Wrap the pre element
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(copyButton);
        
        // Add click event
        copyButton.addEventListener('click', function() {
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(function() {
                // Success feedback
                copyButton.innerHTML = '✅';
                copyButton.classList.add('copied');
                
                setTimeout(function() {
                    copyButton.innerHTML = '📋';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(function() {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Success feedback
                copyButton.innerHTML = '✅';
                copyButton.classList.add('copied');
                
                setTimeout(function() {
                    copyButton.innerHTML = '📋';
                    copyButton.classList.remove('copied');
                }, 2000);
            });
        });
    });
});
