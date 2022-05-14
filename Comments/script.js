const form = document.querySelector(".comment__form");
const like = document.querySelector(".like");
const commentInput = document.getElementById("comment-input");
const commentAuthorInput = document.getElementById("comment-author");
window.onload = main;

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

let comments = [
  {
    id: "12321",
    author: "Amit",
    comment: "hello it is the first comment",
    likes: 23,
    comments: [
      {
        id: "313213",
        author: "jain",
        comment: "dont say hello",
        likes: 12,
        comments: [
          {
            id: "33213",
            author: "jain",
            comment: "pls go say hello",
            likes: 12,
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: "3213",
    author: "viren",
    comment: "just keep say hello",
    likes: 12,
    comments: [],
  },
];

class Comment {
  comments = [];
  root = null;
  constructor(comments) {
    this.comments = comments;
  }

  recursiveRender = (cmts) => {
    const fragment = document.createDocumentFragment();
    cmts.map((singleComment) => {
      let containerDiv = document.createElement("div");
      containerDiv.classList.add("comment__card");
      containerDiv.id = singleComment.id;
      let childHTML = `
          <div class="comment__heading">${singleComment.author}</div>
          <div class="comment__body" contenteditable="true">${
            singleComment.comment
          }</div>
          <div class="comment__footer">
            <div class="like">Like <span class="val">${
              singleComment.likes
            }<span></div>
            <div class="dislike">Dislike ${1000 - singleComment.likes}</div>
            ${`<div class="replies">Repies ${singleComment.comments.length}</div>`}
          </div>
      `;
      containerDiv.innerHTML = childHTML;
      const mappedChildren = this.recursiveRender(singleComment.comments);
      containerDiv.appendChild(mappedChildren);
      fragment.appendChild(containerDiv);
    });
    return fragment;
  };

  addComment = (cmt) => {
    this.comments.push(cmt);
    removeAllChildNodes(this.root);
    this.render(this.root);
  };

  recursiveFinder = (cmts, id, cb) => {
    if (!cmts || !cmts.length) return;
    let idx = -1;
    console.log("cmts : ", cmts);
    for (let cmt of cmts) {
      idx++;
      // console.log("cmt : ", cmt);
      if (cmt.id === id) {
        console.log("before cmts : ", cmts);
        cmts[idx] = cb(cmt);
        console.log("after cmts : ", cmts);
        return;
      }
      this.recursiveFinder(cmt.comments, id, cb);
    }
  };

  incrementLike = (id) => {
    this.recursiveFinder(this.comments, id, (ele) => ({
      ...ele,
      likes: ele.likes + 1,
    }));
    this.render(this.root);
  };

  changeBody = (id, text) => {
    this.recursiveFinder(this.comments, id, (ele) => ({
      ...ele,
      comment: text,
    }));
    this.render(this.root);
  };

  render = (container) => {
    this.root = container;
    const html = this.recursiveRender(this.comments);
    removeAllChildNodes(container);
    container.appendChild(html);
  };
}

const bindedChange = function () {};

// event listner
const onSubmit = function (e) {
  e.preventDefault();
  let comment = {
    author: commentAuthorInput.value,
    comment: commentAuthorInput.value,
    likes: 0,
    id: Math.floor(Math.random() * 10000 + 1),
    comments: [],
  };
  this.addComment(comment);
};
const onClick = function (e) {
  let target = e.target;
  let closest = target.closest(".comment__card");
  if (target.classList.contains("like")) {
    this.incrementLike(closest.id);
  }
  if (target.classList.contains("replies")) {
    const nestedChilds = closest.querySelectorAll(":scope > .comment__card");
    console.log("nestedChilds : ", nestedChilds);
    nestedChilds.forEach((s) => {
      s.classList.toggle("hide");
    });
  }
  if (target.classList.contains("comment__body")) {
    const nestedChilds = closest.querySelectorAll(":scope > .comment__card");
    // console.log("target.value : ", target.value);
    let obj = { val: 9, changeBody: this.changeBody };
    obj.val = target.value;
    console.log("closest.id : ", closest.id);
    let change = function (ev) {
      console.log("this,val : ", this);
      console.log("val,closest.id : ", this.val, closest.id);
      this.changeBody(closest.id, this.val);
    };
    let bindedChange = change.bind(obj);
    target.addEventListener("input", (ev) => {
      obj.val = ev.target.innerText;
      // console.log("obj : ",);
    });

    target.addEventListener("blur", bindedChange);
  }
};

function main() {
  const commentContainer = document.querySelector(".commets__container");
  let commentWidget = new Comment(comments);
  commentWidget.render(commentContainer);

  // binding with the library
  const bindedOnsubmit = onSubmit.bind(commentWidget);
  const bindedOnClick = onClick.bind(commentWidget);

  // adding event listner
  form.addEventListener("submit", bindedOnsubmit);
  commentContainer.addEventListener("click", bindedOnClick);
}

// call apply bind will not work with arrow functions
