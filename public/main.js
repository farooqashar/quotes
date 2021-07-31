const user_input = document.querySelector('#update-button')
const delete_btn = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');


user_input.addEventListener('click', _ => {

  var u_name = prompt("Enter the name of the quote's author:");
  var u_quote = prompt(`Enter the updated quote for ${u_name}`);

  fetch('/quotes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: u_name,
      quote: u_quote
    })
  })
  .then(res => {
      if (res.ok) return res.json();
  })
  .then(response => {
      window.location.reload();
  })
});

delete_btn.addEventListener('click', i => {

    var d_name = prompt("Enter the name of the quote's author:");

    fetch('quotes', {
        method: 'delete',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({name: d_name})
    })
    .then(res => {if (res.ok) return res.json();})
    .then(data => {
        if (data === "No more quotes to delete") {
            messageDiv.textContent = "No more quotes to delete";
        } else {
        window.location.reload()
        }
        });
});


