(function () {
  'use strict';
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      q.classList.toggle('open');
      var answer = q.nextElementSibling;
      answer.classList.toggle('open');
    });
  });
  var user = JSON.parse(localStorage.getItem('Seek2Learn_user') || 'null');
  var navCta = document.querySelector('.nav-cta');
  if (navCta && user) {
    navCta.innerHTML =
      '<span style="color:var(--text);font-weight:600;margin-right:12px;">Hi, ' + user.fullName.split(' ')[0] + '</span>' +
      '<a href="#" class="btn btn-coral" id="logout-btn">Logout</a>';
    document.getElementById('logout-btn').addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('Seek2Learn_user');
      window.location.reload();
    });
  }
})();
