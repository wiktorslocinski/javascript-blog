{
  'use strict';


  /*
  document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });
  */
 
  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    console.log('Link was clicked!');
    console.log(event);
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };
  

  const optArticleSelector = '.post'
  optTitleSelector = '.post-title'
  optTitleListSelector = '.titles';


  function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  function clearMessages() {
    titleList.innerHTML = '';
  }
  clearMessages();
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);
    /* find the title element */
    const titleElement = article.querySelector(optTitleSelector);
    /* get the title from the title element */
    const title = titleElement.innerHTML;
    /* create HTML of the link */
    const linkHTML= '<li><a href="#' + articleId + '"><span>' + title + '</span></a></li>';
    /* insert link into titleList */
    html = html + linkHTML;

  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();
}