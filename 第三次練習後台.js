// $(document).ready(function () {
//     $(".header .moible").click(function (e) { 
//         e.preventDefault();
//         $(".header .menu").toggleClass("add");
//     });
//   });
//  bill60800
//  fy7m4bYPzKYrvMuECEXR38iTclm2

let orderList = []
function init(){
    TokenList()
}
init()


//渲染訂購訂單
const BackstageOrderItem = document.querySelector('.BackstageOrder-item')


function TokenList(){
   axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/bill60800/orders',{
       headers : {
        authorization : 'fy7m4bYPzKYrvMuECEXR38iTclm2'
       }
   })
   .then(res=>{
       orderList = (res.data.orders)
       let str = ''
       orderList.forEach((item,index)=>{
           //組產品字串
           let product = ''
           item.products.forEach(item=>{
               product += `${item.title}*${item.quantity}<br>`
           })
           //組訂單狀態
           let orderStatus = ''
           if(item.paid == false){
              orderStatus = '未處理'
           }else{
               orderStatus = '已處理'
           }
           //組時間
           let data = ''
           let timestamp3 = item.updatedAt
           let newDate = new Date();
           newDate.setTime(timestamp3 * 1000);
           data = newDate.toLocaleDateString()
          str += ` <tr>
          <td style="width: 10%;">${item.id}</td>
          <td style="width: 10%;">${item.user.name}<br>${item.user.tel}</td>
          <td style="width: 18%;">${item.user.address}</td>
          <td style="width: 18%;">${item.user.email}</td>
          <td style="width: 18%;">${product}</td>
          <td style="width: 10%;">${data}</td>
          <td style="width: 8%;"><a href="#" data-status='${item.paid}' class='orderStatus' data-id='${item.id}'>${orderStatus}</a></td>
          <td style="width: 8%;"><input type="button" value="刪除" class="deleteSelf" data-id='${item.id}'></td>
      </tr>`
       })
       BackstageOrderItem.innerHTML = str
       renderC3()
   })
}

//修改訂單狀態

BackstageOrderItem.addEventListener('click',e=>{
    e.preventDefault()
    if(e.target.getAttribute('class') == 'orderStatus'){
        let id = e.target.getAttribute('data-id')
        let status 
        if(e.target.getAttribute('data-status') == 'true'){
            status = false
        }else{
            status = true
        }
        axios.put('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/bill60800/orders',{
            'data': {
                'id': id,
                'paid': status
              }
        },{
            headers : {
                authorization : 'fy7m4bYPzKYrvMuECEXR38iTclm2'
               }
        })
        .then(res=>{
            alert('訂單狀態修改成功!')
            TokenList()
        })
    }else if(e.target.value == '刪除'){
        let id = e.target.getAttribute('data-id')
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/bill60800/orders/${id}`,{
            headers : {
                authorization : 'fy7m4bYPzKYrvMuECEXR38iTclm2'
               }
        })
        .then(res=>{
            alert('刪除該訂單成功!')
            TokenList()
        })
    }
})

//刪除全部品項

const deleteALLItem = document.querySelector('.deleteALL-item')

deleteALLItem.addEventListener('click',e=>{
    if(e.target.value == '刪除全部品項'){
        axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/bill60800/orders',{
            headers : {
                authorization : 'fy7m4bYPzKYrvMuECEXR38iTclm2'
               }
        })
        alert('全部訂單刪除成功!')
        TokenList()
    }
})

//C3圖表
function renderC3(){
  console.log(orderList)
  let obj = {}
  orderList.forEach(item=>{
      item.products.forEach(product=>{
          console.log(product.title)
          console.log(product.quantity)
          if(obj[product.title] == undefined){
              obj[product.title] = product.quantity*product.price
          }else{
              obj[product.title]+=product.quantity*product.price
          }
      })
  })
  console.log(obj)
  const ary = Object.keys(obj)
  console.log(ary)
  let totalAry = []
  ary.forEach((item,index)=>{
      let add = []
      add.push(item)
      add.push(obj[item])
      totalAry.push(add)
  })
  console.log(totalAry)
  totalAry.sort((a,b)=> b[1]-a[1])
  console.log(totalAry)
  //超過四筆就整理出其他
  if(totalAry.length>3){
      let ortherPrice = 0
      totalAry.forEach((item,index)=>{
          if(index>2){
            ortherPrice += totalAry[index][1]
          }
      })
      totalAry.splice(3,totalAry.length-3)
      totalAry.push(['其他',ortherPrice])
  }
  console.log(totalAry)

  var chart = c3.generate({
    bindto: '.c3Pct', //圖要放在html裡的chart這個class中
    data:{
        columns:totalAry,
        type:'pie', //圖的種類是圓餅圖
    },
    color:{
        pattern:['#301E5F','#5434A7','#9D7FEA','#DACBFF']
    }
});
}
