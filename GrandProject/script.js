function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
class Ecommerce {
  prducts = [];
  filteredProducts = [];
  tags = [];
  itemsRoot = null;
  tagsRoot = null;
  constructor(prducts, itemsRoot, tagsRoot) {
    this.prducts = prducts;
    this.itemsRoot = itemsRoot;
    this.tagsRoot = tagsRoot;
    const tagSet = new Set();
    for (let product of this.prducts) {
      tagSet.add(product.catagory);
    }
    let tempTags = [];
    for (let t of tagSet) {
      tempTags.push({
        name: t,
        active: false,
      });
    }
    this.tags = tempTags;
    this.filteredProducts = this.prducts;
  }
  setActiveTab(id, val) {
    console.log("this.tags[id] : ", this.tags[id]);
    this.tags[id] = {
      ...this.tags[id],
      active: val,
    };
    console.log("this.tags[id] : ", this.tags[id]);
    this.updateFilteredProducts();
    this.render();
  }
  sortProducts() {}
  updateFilteredProducts() {
    let activeTags = this.tags.filter((t) => t.active).map((t) => t.name);
    if (this.tags.length === activeTags.length || !activeTags.length) {
      this.filteredProducts = this.prducts;
      return;
    }
    console.log("activeTags : ", activeTags);
    this.filteredProducts = this.filteredProducts.filter((p) => {
      return activeTags.includes(p.catagory);
    });
    this.sortProducts();
    // console.log("this.filteredProducts : ", this.filteredProducts);
  }
  generateItemsStore() {
    let frag = document.createDocumentFragment();
    this.filteredProducts.forEach((p) => {
      let itemHtml = document.createElement("div");
      itemHtml.classList.add("item");

      itemHtml.innerHTML = `
            <img
              class="img"
              src="${p.img}"
            ></img>
            <div class="item__info">
              <h2 class="name">${p.item}</h2>
              <h3 class="price">₹${p.price}</h3>
              <div class="item__ratings">
                <h3 class="rating">${p.review}⭐</h3>
                <h3 class="eta">ETA ${p.ETA}days</h3>
              </div>
            </div>
      `;
      frag.append(itemHtml);
    });
    return frag;
  }

  sortPrice(inc) {
    console.log("before this.filteredProducts : ", this.filteredProducts);
    this.filteredProducts = this.filteredProducts.sort((a, b) =>
      inc ? a.price - b.price : b.price - a.price
    );
    this.render();
  }
  sortDate(inc) {
    console.log("before this.filteredProducts : ", this.filteredProducts);
    this.filteredProducts = this.filteredProducts.sort((a, b) =>
      inc ? a.ETA - b.ETA : b.ETA - a.ETA
    );
    console.log("after this.filteredProducts : ", this.filteredProducts);
    this.render();
  }
  sortReview(inc) {
    console.log("before this.filteredProducts : ", this.filteredProducts);
    this.filteredProducts = this.filteredProducts.sort((a, b) =>
      inc ? a.review - b.review : b.review - a.review
    );
    this.render();
  }
  getnerateTags() {
    let frag = document.createDocumentFragment();
    this.tags.forEach((tag, idx) => {
      let tagHtml = document.createElement("div");
      tagHtml.classList.add("tag");
      tagHtml.dataset.tagIdx = idx;
      tagHtml.innerText = tag.name;
      tag.active && tagHtml.classList.add("active");
      frag.append(tagHtml);
    });
    return frag;
  }

  render() {
    const itemsHtml = this.generateItemsStore();
    const tagsHtml = this.getnerateTags();
    removeAllChildren(this.itemsRoot);
    removeAllChildren(this.tagsRoot);
    this.itemsRoot.append(itemsHtml);
    this.tagsRoot.append(tagsHtml);
  }
  renderTags() {
    const tagsHtml = this.getnerateTags();
    removeAllChildren(this.tagsRoot);
    this.tagsRoot.append(tagsHtml);
  }
}

const loadData = async (URL, body) => {
  const res = await fetch(URL, body);
  const data = await res.json();
  return data;
};

const main = async () => {
  const itemsWrapper = document.querySelector(".items-wrapper");
  const tagsWrapper = document.querySelector(".tags-wrapper");
  const selectButton = document.querySelector(".filter-item");
  console.log("selectButton : ", selectButton);
  const data = await loadData("./data.json");
  const EcommerceStore = new Ecommerce(data, itemsWrapper, tagsWrapper);

  EcommerceStore.render();
  const bindedselectChangeHandler = selectChangeHandler.bind(EcommerceStore);
  const bindedTagClickHandler = tagClickHandler.bind(EcommerceStore);

  tagsWrapper.addEventListener("click", bindedTagClickHandler);
  selectButton.addEventListener("change", bindedselectChangeHandler);
};

window.onload = main;

function tagClickHandler(e) {
  if (e.target.classList.contains("tag")) {
    let idx = e.target.dataset.tagIdx;
    this.setActiveTab(
      idx,
      e.target.classList.contains("active") ? false : true
    );
  }
}
function selectChangeHandler(e) {
  if (e.target.classList.contains("filter-item")) {
    switch (e.target.value.toLowerCase()) {
      case "price":
        this.sortPrice();
        break;
      case "review":
        this.sortReview();
        break;
      case "eta":
        this.sortDate();
        break;
      default:
        break;
    }
  }
}
