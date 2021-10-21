const input = document.querySelector('.input');
const submit = document.querySelector('.submit-btn');
const loader = document.querySelector('.loader');
let question = '';
let inputErrorAdded = false;
let submitErrorAdded = false;

// hide loader
loader.style.display = 'none';
submit.classList.add('submit-btn-enabled');

const editErrorNode = () => {
    // validate question
    if (question[question.length - 1] !== '?' && !inputErrorAdded) {
        // add error node
        const inputContainer = document.querySelector('.input-container');
        const errorNode = document.createElement('p');
        errorNode.textContent = 'Please enter a question (ending with a question mark).'
        errorNode.style.marginBottom = '0';
        inputContainer.appendChild(errorNode);

        // change box to red
        input.style.border = '1px solid red';

        inputErrorAdded = true;
        submit.disabled = true;
        submit.classList.remove('submit-btn-enabled');
    } else if (question[question.length - 1] === '?' && inputErrorAdded) {
        // remove error node
        const node = document.querySelector('.input-container').lastChild;
        node.remove();

        // remove red styling
        input.style.border = '1px solid black';
        
        inputErrorAdded = false;
        submit.disabled = false;
        submit.classList.add('submit-btn-enabled');
    }
};

input.addEventListener('blur', () => {
    if (input.value === '') {
        submit.disabled = true;
    }

    editErrorNode();
});

input.addEventListener('change', (e) => {
    question = e.target.value;
    editErrorNode();
});

submit.addEventListener('click', () => {
    // add loader
    loader.style.display = 'grid';

    const params = encodeURIComponent(question);
    const uri = "https://8ball.delegator.com/magic/JSON/" + params;
    
    fetch(uri)
        .then(response => response.json())
        .then(result => {
            // remove loader
            loader.style.display = 'none';

            const question = document.querySelector('.question');
            question.textContent = result.magic.question;

            const answer = document.querySelector('.answer');
            answer.textContent = result.magic.answer;

            // remove error node
            if (submitErrorAdded) {
                const node = document.querySelector('.result-container').lastChild;
                node.remove();

                submitErrorAdded = false;
            }
        })
        .catch(e => {
            // remove loader
            loader.style.display = 'none';

            if (!submitErrorAdded) {
                // add error node
                const inputContainer = document.querySelector('.result-container');
                const errorNode = document.createElement('p');
                errorNode.textContent = 'API error: Please try again later.';
                inputContainer.appendChild(errorNode);

                submitErrorAdded = true;
            }
        });
});