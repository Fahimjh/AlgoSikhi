
  const arrayValues = [10, 20, 30, 40];
  const arrayContainer = document.getElementById("array");

  function renderArray() {
    arrayContainer.innerHTML = '';
    arrayValues.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = value;
      cell.dataset.index = index;
      arrayContainer.appendChild(cell);
    });
  }

  function insertAt(index, value) {
    // Step 1: Shift values right (visual)
    const cells = document.querySelectorAll('.cell');
    for (let i = cells.length - 1; i >= index; i--) {
      const target = cells[i];
      target.style.transform = 'translateX(60px)';
    }

    // Step 2: Wait, then insert new value
    setTimeout(() => {
      arrayValues.splice(index, 0, value);
      renderArray();

      // Highlight the inserted cell
      const inserted = document.querySelectorAll('.cell')[index];
      inserted.classList.add('highlight');
      setTimeout(() => inserted.classList.remove('highlight'), 1000);
    }, 600);
  }

  // Initial render
  renderArray();