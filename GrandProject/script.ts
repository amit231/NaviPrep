interface Product{
  catagory:string,
  item:string,
  img:string,
  review:number
  ETA:number,
  price:number
}



class Ecommerce{
  prducts:Product[] = [];

  constructor(){
  }



  
}



const loadData = async(URL:string,body?:object)=>{
  const res = await fetch(URL,body);
  const data = await res.json()
  return data; 
}







const main = async () => {
  const wrapper = document.querySelector(".wrapper");
  wrapper?.innerHTML = 'Loading'
  const data = await loadData('./data.json');

  const EcommerceStore = new Ecommerce()
};

window.onload = main;
