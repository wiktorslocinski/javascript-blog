/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tagCloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-authorCloud-link').innerHTML
  ),
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  
  /*remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /*add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);
  /*  remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /*add class 'active' to the correct article */
  targetArticle.classList.add('active');
}
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){
    
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    console.log(article);
  
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;    
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    html += linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999,
  };
  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = tags[tag] > params.max ? tags[tag] : params.max;
    params.min = tags[tag] < params.min ? tags[tag] : params.min;
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    console.log(article);
    /* find tags wrapper */
    const tagLists = article.querySelector('.post-tags');
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags'),
      /* split tags into array */
      articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = { id: tag, title: tag };
      
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagLists.innerHTML = html;
    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    //let allTagsHTML = '';
    const allTagsData = { tags: [] };
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }
}

generateTags();

function tagClickHandler(event){
  /*  prevent default action for this event */ 
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /*  make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks){
    /*remove class active */
    activeLink.classList.remove('active');
    /*END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each found tag link */
  for(let link of equalLinks){
    /* add class active */
    link.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
  
}
function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let link of tagLinks){
    /*add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /*END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll('article');
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    // eslint-disable-next-line no-unused-vars
    const authorWrapper = article.querySelector('.post-author');
    /* get authors from data-tags attribute */
    const dataAuthor = article.getAttribute('data-author');
    /* create html authors links */
    const linkHTMLData = { id: dataAuthor, title: dataAuthor };
    const linkHtml = templates.authorLink(linkHTMLData);
    /* insert HTML of all the links into the author wrapper */
    const insertLink = article.querySelector('.post-author');
    insertLink.innerHTML = linkHtml;
    /* END LOOP: for every article: */
    /* [NEW] check if this link is NOT already in allAuthors */
    if (!allAuthors[dataAuthor]) {
      /* [NEW] add author to allAuthors object */
      allAuthors[dataAuthor] = 1;
    } else {
      allAuthors[dataAuthor]++;
    }
  }
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const authorList = document.querySelector('.authors');
  /* [NEW] create variable for all links HTML code */
  const authorParams = calculateTagsParams(allAuthors);
  console.log('authorParams:', authorParams);
  const allAuthorsData = { authors: [] };

  /* [NEW] START LOOP: for each tag in allAuthors: */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tag + " (" + allTags[tag] + ") ";
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateTagClass(allAuthors[author], authorParams),
    });
  }
  /* [NEW] END LOOP: for each tag in allAuthors: */

  /*[NEW] add HTML from allAuthorsHTML to authorList */
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  console.log(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  console.log('Click author link!');
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.innerText;
  /* make a new constant "tag" and extract tag from the "href" constant getAttribute("href")*/
  const author = href.replace('#tag-', '');
  //const tag = href.replace('#tag=", "');
  /* find all tag links with class active -> wszystkie aktywne linki do tagów */
  const activeAuthorsLinks = document.querySelectorAll(
    'a.active a[href^="#tag-"]'
  );
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorsLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefEqualAuthorsLinks = document.querySelectorAll(
    'a[href="' + href + '"]'
  );
  /* START LOOP: for each found tag link */
  for (let hrefEqualAuthorLink of hrefEqualAuthorsLinks) {
    /* add class active */
    hrefEqualAuthorLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-author="${author}"]`);
}
function addClickListenersToAuthors() {
  /* find all links to authors */
  const linksToAuthors = document.querySelectorAll('.post-author');
  const linksToAuthorsRight = document.querySelectorAll('.authors li');
  /* START LOOP: for each link */
  for (let linkToAuthor of linksToAuthors) {
    /* add tagClickHandler as event listener for that link */
    linkToAuthor.addEventListener('click', authorClickHandler);
  }
  for (let linkToAuthorRight of linksToAuthorsRight) {
    linkToAuthorRight.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link authorClickHandler*/
}

addClickListenersToAuthors();