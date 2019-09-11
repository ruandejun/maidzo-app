export const jsHide1688Thing = `
    function hideWebThings() {
        var hides = document.querySelectorAll('.footer-bar-container');
        hides.forEach(function(h){h.style.display='none';});

        var banners = document.querySelectorAll('.banner-and-poplayer');
        banners.forEach(function(banner){banner.style.display='none';});

        var detailHeaders = document.querySelectorAll('.J_DetailHeaderLayout');
        detailHeaders.forEach(function(header) {header.style.display='none';});

        var bars = document.querySelectorAll('.detail-footer-container');
        bars.forEach(function(bar) {bar.style.display='none';});
    }
    hideWebThings();
    `



export const jsCheck1688ReadyToAddCart = `
    function checkReadyToAddCart() {
      var canAddCart = false;
      var element = document.getElementsByClassName('J_SelectedTotalAmount')[0];
      if(element){
          var count = element.innerText;
          if(count > 0){
              canAddCart = true
          }
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'checkReadyToAddCart', value: canAddCart}))
    }
    checkReadyToAddCart();
`

export const js1688ShowOptionsPopup = `
    function forceShowOptionPopup(){
    var addCart = document.getElementsByClassName('takla-item-content has-item-arrow J_SkuBtn')[0]; 
    if(addCart) { 
        addCart.click();
    } else { 
        addCart = document.getElementsByClassName('takla-item-content')[0];
        if(addCart) { 
            addCart.click();
        }
    }
    }
    forceShowOptionPopup();

    function hidePopupAddToCartButtons() {
        var modalBtns = document.querySelectorAll('.selector-btn-group');
        modalBtns.forEach(function(btn) {btn.style.display='none';});
    }
    hidePopupAddToCartButtons();
`

export const jsGet1688ProductDetailForCart = `
function getProductDetailForCart() {
    var product = {
        title : "1688 product name",
        price : 0.0,
        quantity : 1,
        options : [],
        image : "url_of_selected_product_image",
        parentImage : "url_of_parent_image_as_default",
        detailUrl : "product_source_url",
        shop_name : "shop_name",
        currency : "CNY"
      };

      product.detailUrl = window.location.href;
      product.title = document.getElementsByClassName('title-text')[0].innerText;
      product.shop_name = document.getElementsByClassName('shop-name-text')[0].innerText;
      
      var specialPrice = document.getElementsByClassName('J_SkuPriceItem active-price')[0];
      if(specialPrice){
        product.price = parseFloat(specialPrice.getElementsByClassName('price-num')[0].innerText.replace('￥', ''));
      }

      var prdImages = document.querySelectorAll('.selector-current-image .image-container img');
      product.image = prdImages[0].src;
      product.parentImage = document.getElementsByClassName('J_SkuPreviewImage')[0].getAttribute('src');

      var selectedOptions = [];
      var element = document.getElementsByClassName('sku-1st-prop-box')[0];
      if(element){
        var option = {
            propertyTitle : element.getElementsByClassName('prop-name-text')[0].innerText,
            propertyValue : element.getElementsByClassName('active-sku-item')[0].innerText
        };
        selectedOptions.push(option);
      }

      element = document.getElementsByClassName('sku-2nd-prop-box')[0];
      if(element){
        var propertyTitle = element.getElementsByClassName('prop-name-text')[0].innerText;
        var options = element.querySelectorAll('.sku-2nd-prop-list li');
        options.forEach(function(node) {
            var propertyValue = node.getElementsByClassName('main-text')[0].innerText;
            
            var quantity = parseInt(node.getElementsByClassName('amount-input')[0].value);
            var price = parseFloat(node.getElementsByClassName('price-text')[0].innerText.replace('￥', ''));

            if(quantity > 0 && (price || specialPrice)){
                
                product.quantity = quantity;

                if(price){
                    product.price = price;
                }

                product.options = [...selectedOptions, {propertyTitle, propertyValue}];

                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getProductDetailForCart', value: product}))
            }
        });
      }

      closeOptionPopup();
}

function closeOptionPopup() {
    var modalBtns = document.querySelectorAll('.takla-wap-b2b-skuselector-component');
    modalBtns.forEach(function(btn) {btn.style.display='none';});
}
getProductDetailForCart();
`