var ModalOptions={};


$(document).ready(function () {     
    initModal(ModalOptions);
});

// //启动ws连接
// function wsStart(wsUrl) {
//     ws=new WebSocket(wsUrl);
//     // var testStr={key1:"value1",key2:"value2",key3:"value3",}
//     ws.onopen=function () {               
//         console.log('连接websocket服务成功：'+wsUrl);        
//     };
//     ws.onmessage=function (e) {
//         // console.log('收到消息');
//         var title='test-title';
//         createModal(e.data,title);           //弹框
//     }
// }

/**
 * 默认配置
 * modalHeight          每个modal的高度
 * modalWidth           每个modal宽度
 * maxNum               显示的modal数量
 * modalTitle           标题
 * bottomHeight         modal距离底部的高度
 * modalHeaderHeight    标题高度
 * modalMargin          modal的上下margin值
 * btnInnerFirst        第一个button的内容
 * btnInnerSecond       第二个button的内容
 */
var ModalConfig={
    modalHeight:140,
    modalWidth:400,
    maxNum:3,
    modalTitle:'test title',
    bottomHeight:0,
    modalHeaderHeight:30,
    modalMargin:4,
    btnInnerFirst:'Cancel',
    btnInnerSecond:'Okey',
};

function initModal(ModalOptions){
    for(prop in ModalOptions){
        if(ModalOptions[prop]){
            ModalConfig[prop]=ModalOptions[prop];
        }
    }
    boxCss();    
}

//创建提示框
function createPopBox(data,title){
    var modalBox=document.getElementById('alarm-box');          //找到box
    var aModal=document.createElement('div');                   //创建模态框元素
    alarmStr="";                                                //渲染     
    if(typeof(data)=='object'&&data!=null){
        for(key in data){
            alarmStr+=key+'：'+data[key]+'；';
        }
    }else if(typeof(data)=='string'){
        alarmStr=data;
    }               
    
    aModal.className='alarm-modal panel panel-danger';

    aModal.innerHTML='<div class="alarm-header panel-heading"><h4 class="alarm-title">'+
    title+'</h4></div><div class="alarm-body panel-body"><p>'+
    alarmStr+'</p><div class="alarm-footer"><button class="btn btn-default btn-sm">'+
    ModalConfig.btnInnerFirst+'</button><button class="btn btn-primary btn-sm">'+
    ModalConfig.btnInnerSecond+'</button></div></div>'
    aModal.onclick=function(event){                              //注册点击事件
        modalClick(event);
    }    
    pushModal(aModal,modalBox);
}

//弹框
function pushModal(aModal,modalBox){        
    if($('.alarm-modal').length>=ModalConfig.maxNum){                        //数量达到上限，则向下推
        $('.alarm-modal').animate({
            top:'+='+ModalConfig.modalHeight+'px',
        },500,function(){
            modalBox.insertBefore(aModal,modalBox.firstChild);
            modalCss();        
            boxPadding();
            $('.alarm-modal').css('top','0px');
        });    
    }else if($('.alarm-modal').length<ModalConfig.maxNum){                   //未达上限，则直接插到首位
            modalBox.insertBefore(aModal,modalBox.firstChild);
            modalCss();        
            boxPadding();
    }
        
}

//模态框的点击事件
function modalClick(event){
    var t=event.target;
    //console.log(typeof(t));
    if(t.className=='btn btn-default btn-sm'){
        popModal(t);        
    }else if(t.className=='btn btn-primary btn-sm'){
        popModal(t);        
    }
}

//删除弹框
function popModal(t){
    var thisModal=t.closest('.alarm-modal');        
    var prevs=jQuery(thisModal).prevAll('.alarm-modal');
    var nexts=jQuery(thisModal).nextAll('.alarm-modal');
    if($('.alarm-modal').length>ModalConfig.maxNum){                 //数量大于上限，则将下方modal上移
        jQuery(thisModal).fadeOut(200);   
        if(nexts!=0){
            nexts.animate({
                top:'-='+ModalConfig.modalHeight+'px',
            },200,function(){
                thisModal.remove();   
                boxPadding(); 
                $('.alarm-modal').css('top','0px');               
            });
        }else{
            thisModal.remove();
            boxPadding(); 
            $('.alarm-modal').css('top','0px');  
        }
    }else if($('.alarm-modal').length<=ModalConfig.maxNum){          //数量未达到上限，则将所有modal向下靠拢
        jQuery(thisModal).fadeOut(200);
        if(prevs.length!=0){
            prevs.animate({
                top:'+='+ModalConfig.modalHeight+'px',
            },{duration:200,complete:function(){
                thisModal.remove();
                boxPadding(); 
                $('.alarm-modal').css('top','0px');               
            }   
            })   
        }else{            
            jQuery(thisModal).fadeOut(200,function(){
                thisModal.remove();   
                boxPadding(); 
                $('.alarm-modal').css('top','0px'); 
            });
        }              
    }                
}

//计算box
function boxCss(){    
    //console.log('document.body.offsetHeight :'+document.body.offsetHeight );
    $('#alarm-box').css('top',document.body.offsetHeight-ModalConfig.maxNum*(ModalConfig.modalHeight+ModalConfig.modalMargin*2)-ModalConfig.bottomHeight+'px');
    $('#alarm-box').css('width',ModalConfig.modalWidth);
}

function modalCss(aModal){       
    $('.alarm-header').css('width',ModalConfig.modalWidth+'px');
    $('.alarm-modal').css('height',ModalConfig.modalHeight+'px');
    $('.alarm-modal').css('width',ModalConfig.modalWidth+'px');
    $('.alarm-modal').css('margin',ModalConfig.modalMargin+'px');
    $('.alarm-body').css('height',ModalConfig.modalHeight-ModalConfig.modalHeaderHeight+'px');
}

//计算box的padding值，确定modal位置；修改modal尺寸
function boxPadding(){
    var marginTop=0;
    if(ModalConfig.maxNum>$('.alarm-modal').length){
        marginTop=(ModalConfig.maxNum-$('.alarm-modal').length)*(ModalConfig.modalHeight+ModalConfig.modalMargin*2);
    }
    $('#alarm-box').css('margin-top',marginTop+'px');         
}