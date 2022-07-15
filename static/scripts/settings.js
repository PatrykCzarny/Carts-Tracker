const QS = (selector, qsAll = false) => {
    return qsAll ? document.querySelectorAll(selector) : document.querySelector(selector)
}

const listenerOption = () => {
    const rowsList = QS('.row', true);
    rowsList.forEach(row => {

        const rowSelect = row.querySelector('select');
        rowSelect.addEventListener('change', () => {
            const rowOptionStyleBGC = row.querySelector(`.${rowSelect.value}`).dataset.stylebgc;
            row.querySelector('span').style.backgroundColor = `#${rowOptionStyleBGC}`;
            row.querySelector('span').style.color = '#000';
        })

        const btnRemoveRow = row.querySelector('.deleteRow');
        btnRemoveRow.addEventListener('click', () => {
            row.parentElement.removeChild(row);
        })
    });
}

listenerOption();