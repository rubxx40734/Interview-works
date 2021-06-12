// =============這是swiper===============
const mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed:1000,
    effect:"horizontal",

  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
  });

//  bill60800
//  fy7m4bYPzKYrvMuECEXR38iTclm2

$(document).ready(function () {
  $(".header .moible").click(function (e) { 
      e.preventDefault();
      $(".header .menu").toggleClass("add");
  });
});

let data = []
let cardData = []
let total;
const productList = document.querySelector('.productList')

function init(){
    getProductList()
    getOrderList()
}
init()

//新增購物清單

function getProductList(){
  axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/products')
  .then(function(res){
      data=(res.data.products)
      // getProductList()
      console.log(data)
      let str = ''
      data.forEach((item,index) =>{
          str+=`<li>
          <div class="img">
            <p class="newLogo">新品</p>
            <img src="${item.images}" alt="">
            <div class='addCart'><input type="button" class="addCartBtn" data-id='${item.id}' value="加入購物車"></div>
          </div>
          <div class="info">
            <p class="item">${item.title}</p>
            <p class="price">NT$ ${toCurrency(item.origin_price)}</p>
            <p class="sell">NT$ ${toCurrency(item.price)}</p>
          </div>
        </li>`
        
      })
      productList.innerHTML=str
  })
   
}


//商品篩選

const productChoose = document.querySelector('.productChoose')
productChoose.addEventListener('click',(e)=>{
    if(e.target.value == '全部'){
      getProductList()
        return
    }else{
        let str = ''
        data.forEach(function(item,index){
            if(e.target.value == item.category){
                str += `<li>
                <div class="img">
                  <p class="newLogo">新品</p>
                  <img src="${item.images}" alt="">
                  <div class='addCart'><input type="button" class="addCartBtn" data-id='${item.id}' value="加入購物車"></div>
                </div>
                <div class="info">
                  <p class="item">${item.title}</p>
                  <p class="price">NT$ ${toCurrency(item.origin_price)}</p>
                  <p class="sell">NT$ ${toCurrency(item.price)}</p>
                </div>
              </li>`
            }
           productList.innerHTML = str
        })
    }
})

//新增購物車
const myshoopingJs = document.querySelector('.myshoopingJs')
const totalPrice = document.querySelector('.totalPrice')

function getOrderList(){
  axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/carts')
  .then(function(res){
    cardData = (res.data.carts)
    total = (res.data.finalTotal)
    let str = ''
    cardData.forEach(function(item,index){
      str += `  <tr>
      <td>
        <div class="myshooping-item">
         <img src="${item.product.images}" alt="">
         <p>${item.product.title}</p>
        </div>
      </td>
      <td class="setting"><p>NT$ ${toCurrency(item.product.price)}</p></td>
      <td class="setting"><p>${item.quantity}</p></td>
      <td class="setting"><p>NT$ ${toCurrency(item.product.price*item.quantity)}</p></td>
      <td><p><input type="button" class="deleteSelf" data-id="${item.id}" value='刪除'></p></td>
    </tr>`
    })
    myshoopingJs.innerHTML = str
    totalPrice.innerHTML = `  <p>總金額</p>
    <p>NT $ ${toCurrency(total)}</p>`
  })
}

//新增購物車品項
productList.addEventListener('click',function(e){
  if(e.target.value == '加入購物車'){
    let id = e.target.getAttribute('data-id')
    let num = 1
    cardData.forEach(function(item){
      if( id === item.product.id){
        num = item.quantity+=1
      }
    })
    axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/carts',{
      "data": {
        "productId": id,
        "quantity": num
      }
    })
    .then(function(res){
      alert('新增成功')
      getOrderList()
    })
  }
  
})

//刪除全部品項
const shoppingCarItem = document.querySelector('.shoppingCar-item')

shoppingCarItem.addEventListener('click',function(e){
  if(e.target.value !== '刪除所有品項'){
    return
  }else{
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/carts')
      .then(function(res){
        alert('已清空購物車!!')
        getOrderList()
      })
      .catch(function(err){
        console.log(err)
      })
  }
})

//刪除特定品項

myshoopingJs.addEventListener('click',function(e){
  if(e.target.value !== '刪除'){
    return
  }else{
    let deleteId = (e.target.getAttribute('data-id'))
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/carts/${deleteId}`)
      .then(function(res){
        alert('刪除該單筆成功!')
        getOrderList()
      })
      .catch(function(err){
        console.log(err)
      })
  }
})

//送出訂單

const personJs = document.querySelector('.person-js')
const phoneJs = document.querySelector('.phone-js')
const emailJs = document.querySelector('.email-js')
const localJs = document.querySelector('.local-js')
const moneyJs = document.querySelector('.money-js')
const send = document.querySelector('.send')
console.log(personJs,phoneJs,emailJs,localJs,moneyJs,send)

send.addEventListener('click',function(e){
  e.preventDefault()
  if(e.target.value !== '送出訂單'){
    return
  }if(personJs.value==''||phoneJs.value==''||emailJs.value==''||localJs.value==''){
    alert('請確認資料是否齊全!!')
    return
  }else{
    axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/orders',{
      "data": {
        "user": {
          "name": personJs.value,
          "tel": phoneJs.value,
          "email": emailJs.value,
          "address": localJs.value,
          "payment": moneyJs.value
        }
      }
    })
    .then(res=>{
      alert('訂單建立成功!!請至後台查看~')
      personJs.value=''
      phoneJs.value=''
      emailJs.value=''
      localJs.value=''
      getOrderList()
    })
  }
})

//千分位函式
function toCurrency(num){
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
