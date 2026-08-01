
function SoftKey3W() 
{   
    var LastError;
	var isIE11 = navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf("rv:11.0") > -1;
	var isEDGE= navigator.userAgent.indexOf("Edge") > -1;
    var u = document.URL;
    var url;
  
    
      var Socket_UK;
    
    if (u.substring(0, 5) == "https") {
    	if(isIE11 || isEDGE)
    	{
    		 if(isIE11)url = "wss://127.0.0.1:4006/xxx"; else url = "ws://127.0.0.1:4006/xxx";
    	}
    	else
    	{
				url = "ws://localhost:4006/xxx";
			}
		} else {
			url = "ws://127.0.0.1:4006/xxx";
		}
   
    
    if (typeof MozWebSocket != "undefined") {
       this.Socket_UK = new MozWebSocket(url,"usbkey-protocol");
    } else {
        this.Socket_UK = new WebSocket(url,"usbkey-protocol");
    }

    this.Socket_UK.onerror = (event) => {
        alert('未能连接服务程序，请确定服务程序是否安装。');
    };
    	   
    this._FindPort = function (UK,start) 
    { 
        var msg = 
        {
            FunName: "FindPort",
            start: start
        };
        UK.send(JSON.stringify(msg));
   };   
    
    this._FindPort_2 = function (UK,start, in_data , verf_data)
    { 
         var msg = 
        {
            FunName: "FindPort_2",
            start: start,
            in_data: in_data,
            verf_data:verf_data
        };
        UK.send(JSON.stringify(msg)); 
    }; 
    
    this._FindPort_3 = function (UK,start,in_data,verf_data)
    { 
        var msg = 
        {
            FunName: "FindPort_3",
            start: start,
            in_data: in_data,
            verf_data:verf_data
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetVersion = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetVersion",
            Path: Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetVersionEx = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetVersionEx",
            Path: Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetID_1 = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetID_1",
            Path: Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetID_2 = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetID_2",
            Path: Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    
    this._sRead = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "sRead",
            Path: Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._sWrite = function (UK,InData, Path)
    { 
         var msg = 
        {
            FunName: "sWrite",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg)); 
    }; 
    
    this._sWrite_2 = function (UK,InData, Path)
    { 
        var msg = 
        {
            FunName: "sWrite_2",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._sWrite_2Ex = function (UK,InData,Path)
    { 
        var msg = 
        {
            FunName: "sWrite_2Ex",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._sWriteEx = function (UK,InData,Path)
    { 
        var msg = 
        {
            FunName: "sWriteEx",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._sWriteEx_New = function (UK,InData,Path)
    { 
        var msg = 
        {
            FunName: "sWriteEx_New",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._sWrite_2Ex_New = function (UK,InData,Path)
    { 
        var msg = 
        {
            FunName: "sWrite_2Ex_New",
            InData: InData,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    
    function _SetBuf(UK,InData,pos)
    { 
        var msg = 
        {
            FunName: "SetBuf",
            InData: InData,
            pos:pos
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _GetBuf(UK,pos)
    { 
        var msg = 
        {
            FunName: "GetBuf",
            pos: pos
        };
        UK.send(JSON.stringify(msg));
    };     
    
     _YRead= function(Address,HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YRead",
            Address:Address,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        Socket_UK.send(JSON.stringify(msg));
    };   
    
    _YWrite= function(InData,Address,HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YWrite",
            InData:InData,
            Address:Address,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        Socket_UK.send(JSON.stringify(msg));
    };   
    
    function _YReadEx(UK,Address,len, HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YReadEx",
            Address:Address,
            len:len,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _YWriteEx (UK,Address,len,HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YWriteEx",
            Address:Address,
            len:len,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YReadString = function (UK,Address,len,HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YReadString",
            Address:Address,
            len:len,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YWriteString = function (UK,InString,Address,HKey,LKey,Path)
    { 
        var msg = 
        {
            FunName: "YWriteString",
            InString:InString,
            Address:Address,
            HKey:HKey,
            LKey:LKey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SetWritePassword = function (UK,W_Hkey,W_Lkey,new_Hkey,new_Lkey,Path)
    { 
        var msg = 
        {
            FunName: "SetWritePassword",
            W_Hkey:W_Hkey,
            W_Lkey:W_Lkey,
            new_Hkey:new_Hkey,
            new_Lkey:new_Lkey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SetReadPassword = function (UK,W_Hkey,W_Lkey,new_Hkey,new_Lkey,Path)
    { 
        var msg = 
        {
            FunName: "SetReadPassword",
            W_Hkey:W_Hkey,
            W_Lkey:W_Lkey,
            new_Hkey:new_Hkey,
            new_Lkey:new_Lkey,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
     
    this._DecString = function (UK,InString,Key)
    { 
        var msg = 
        {
            FunName: "DecString",
            InString:InString,
            Key:Key
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._EncString = function (UK,InString,Path)
    { 
        var msg = 
        {
            FunName: "EncString",
            InString:InString,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._EncString_New = function (UK,InString,Path)
    { 
        var msg = 
        {
            FunName: "EncString_New",
            InString:InString,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._Cal = function(UK,Path)
    { 
        var msg = 
        {
            FunName: "Cal",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._Cal_New = function(UK,Path)
    { 
        var msg = 
        {
            FunName: "Cal_New",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
     this._SetCal= function(UK,Hkey,Lkey,new_Hkey,new_Lkey,Path)
    { 
        var msg = 
        {
            FunName: "SetCal",
            Hkey:   Hkey,
            Lkey:   Lkey,
            new_Hkey:new_Hkey,
            new_Lkey:new_Lkey,
            Path:Path
            
        };
        UK.send(JSON.stringify(msg));
    };  
    
     this._GetProduceDate= function(UK,Path)
    { 
        var msg = 
        {
            FunName: "GetProduceDate",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };  
    
    this._SetID= function(UK,Seed,Path)
    { 
        var msg = 
        {
            FunName: "SetID",
            Seed:Seed,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SetCal_2 = function (UK,Key,Path)
    { 
        var msg = 
        {
            FunName: "SetCal_2",
            Key:Key,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SetCal_New = function (UK,Key,Path)
    { 
        var msg = 
        {
            FunName: "SetCal_New",
            Key:Key,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _SetEncBuf(UK,InData,pos)
    { 
        var msg = 
        {
            FunName: "SetEncBuf",
            InData:InData,
            pos: pos
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _GetEncBuf(UK,pos)
    { 
        var msg = 
        {
            FunName: "GetEncBuf",
            pos: pos
        };
        UK.send(JSON.stringify(msg));
    };   
    

    this._ReSet = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "ReSet",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };     
    
    this._MacAddr = function (UK)
    { 
        var msg = 
        {
            FunName: "MacAddr"
        };
        UK.send(JSON.stringify(msg));
    };   
    
    
    this._GetChipID = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetChipID",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _StarGenKeyPair(UK,Path)
    { 
        var msg = 
        {
            FunName: "StarGenKeyPair",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _GenPubKeyY(UK)
    { 
        var msg = 
        {
            FunName: "GenPubKeyY"
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function _GenPubKeyX(UK)
    { 
        var msg = 
        {
            FunName: "GenPubKeyX"
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function  _GenPriKey(UK)
    { 
        var msg = 
        {
            FunName: "GenPriKey"
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetPubKeyY = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetPubKeyY",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetPubKeyX = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetPubKeyX",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._GetSm2UserName = function (UK,Path)
    { 
        var msg = 
        {
            FunName: "GetSm2UserName",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._Set_SM2_KeyPair = function (UK,PriKey,PubKeyX,PubKeyY,sm2UserName,Path )
    { 
        var msg = 
        {
            FunName: "Set_SM2_KeyPair",
            PriKey:PriKey,
            PubKeyX:PubKeyX,
            PubKeyY:PubKeyY,
            sm2UserName:sm2UserName,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YtSign = function (UK,SignMsg,Pin,Path)
    { 
        var msg = 
        {
            FunName: "YtSign",
            SignMsg:SignMsg,
            Pin:Pin,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YtSign_2 = function (UK,SignMsg,Pin,Path)
    { 
        var msg = 
        {
            FunName: "YtSign_2",
            SignMsg:SignMsg,
            Pin:Pin,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YtVerfiy = function (UK,id,SignMsg,PubKeyX, PubKeyY,VerfiySign,Path)
    { 
        var msg = 
        {
            FunName: "YtVerfiy",
            id:id,
            SignMsg:SignMsg,
            PubKeyX:PubKeyX,
            PubKeyY:PubKeyY,
            VerfiySign:VerfiySign,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SM2_DecString = function (UK,InString,Pin,Path)
    { 
        var msg = 
        {
            FunName: "SM2_DecString",
            InString:InString,
            Pin:Pin,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._SM2_EncString = function (UK,InString,Path)
    { 
        var msg = 
        {
            FunName: "SM2_EncString",
            InString:InString,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    this._YtSetPin = function (UK,OldPin,NewPin,Path)
    { 
        var msg = 
        {
            FunName: "YtSetPin",
            OldPin:OldPin,
            NewPin:NewPin,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._FindU = function (UK,start)
	{ 
        var msg = 
        {
            FunName: "FindU",
            start: start
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._FindU_2 = function (UK,start,in_data,verf_data)
	{ 
        var msg = 
        {
            FunName: "FindU_2",
            start: start,
            in_data: in_data,
            verf_data:verf_data
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._FindU_3 = function (UK,start,in_data,verf_data)
	{ 
        var msg = 
        {
            FunName: "FindU_3",
            start: start,
            in_data: in_data,
            verf_data:verf_data
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._IsUReadOnly = function (UK,Path)
	{ 
        var msg = 
        {
            FunName: "IsUReadOnly",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._SetUReadOnly = function (UK,Path)
	{ 
        var msg = 
        {
            FunName: "SetUReadOnly",
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
	this._SetHidOnly = function (UK,IsHidOnly,Path)
	{ 
        var msg = 
        {
            FunName: "SetHidOnly",
            IsHidOnly:IsHidOnly,
            Path:Path
        };
        UK.send(JSON.stringify(msg));
    };   
    
    function ResetOrder(UK) 
    {
		 var msg = 
        {
            FunName: "ResetOrder"
        };
         UK.send(JSON.stringify(msg));
	 } 
	 
	this.ContinueOrder = function (UK) 
    {
		 var msg = 
        {
            FunName: "ContinueOrder"
        };
         UK.send(JSON.stringify(msg));
     } 
     
     
     this._ComputerName= function(UK)
    { 
        var msg = 
        {
            FunName: "ComputerName"
        };
        UK.send(JSON.stringify(msg));
    };   
     
	 
	 this.SendCmdAndWait = function(IsReturnErr,fun,param1,param2,param3,param4,param5,param6,param7,param8,param9,param10) 
{
 var UK;
	//这里使用了异步的方式，因为WEBSOCKET是异步的
   return new Promise((resolve, reject) => {   

    if (typeof MozWebSocket != "undefined") {
	   UK = new MozWebSocket(url,"usbkey-protocol");
	} else {
		UK = new WebSocket(url,"usbkey-protocol");
	}

	 try
	 {
	      UK.onopen = function() {
	   	   ResetOrder(UK);//这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
	    } 
		    
	    UK.onmessage =function got_packet(Msg) 
	    {
	        var UK_Data = JSON.parse(Msg.data);
	        var return_value;
	        if(UK_Data.type!="Process")return ;//如果不是流程处理消息，则跳过
	        switch(UK_Data.order) 
	        {
	            case 0:
	                {
	                  fun(UK,param1,param2,param3,param4,param5,param6,param7,param8,param9,param10); 
	                }
	                break; //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
	            case 1:
	                {
	                    LastError=UK_Data.LastError;
	                    return_value=UK_Data.return_value;
	                    if( LastError!=0){
	                       if(IsReturnErr)return_value=LastError;
	                     } 
	                     //所有工作处理完成后，关掉Socket
						 UK.close();
						 
						 resolve(return_value);
	                }
	                break;
            }
	    } 
	    UK.onclose = function(){

         }
         UK.onerror = (event) => {
             alert('未能连接服务程序，请确定服务程序是否安装。');
         };
	  }
	 catch(e)  
	  {  
				alert(e.name + ": " + e.message);
				 resolve(false);
	  }  
	}) 
}

    this.GetLastError = function()
    {
        return LastError;
    }

    this.FindPort = function(start) 
    { 
       
        return this.SendCmdAndWait(false,this._FindPort,start);
    }
    
    this.FindPort_2= function( start,in_data,  verf_data )
    {
       return this.SendCmdAndWait(false,this._FindPort_2,start,in_data,  verf_data);
    };

    this.GetVersionEx= function(KeyPath)
    {
         return this.SendCmdAndWait(false,this._GetVersionEx,KeyPath);
    };

    this.GetVersion= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetVersion,KeyPath); 
    };

 	

    this.GetID_1= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetID_1,KeyPath);
    }

    this.GetID_2= function(KeyPath)
    {
       return this.SendCmdAndWait(false,this._GetID_2,KeyPath);

    }
 	
    this.GetChipID= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetChipID,KeyPath);
        
    };

    this.SetWritePassword= function( W_HKey,  W_LKey,  new_HKey,  new_LKey,KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetWritePassword, W_HKey,  W_LKey,  new_HKey,  new_LKey,KeyPath);
    }

    this.SetReadPassword= function( W_HKey,  W_LKey,  new_HKey,  new_LKey,KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetReadPassword,W_HKey,  W_LKey,  new_HKey,  new_LKey,KeyPath);
    }


    this.SetCal_2= function( Key,KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetCal_2,Key,KeyPath);
    }

    this.SetCal_New= function(Key,KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetCal_New,Key,KeyPath);
    }


    this.EncString= function( InString,KeyPath)
    {
        return this.SendCmdAndWait(false,this._EncString,InString,KeyPath);
    }

    this.EncString_New= function( InString,KeyPath)
    {
        return this.SendCmdAndWait(false,this._EncString_New, InString,KeyPath);
    }



    this.Cal= function(Inbuf,KeyPath)
    {
        return this.SubCal(this._Cal,Inbuf,KeyPath);
    }

    this.Cal_New= function(Inbuf,KeyPath)
    {
       return this.SubCal(this._Cal_New,Inbuf,KeyPath)
    }



    this.sWriteEx= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(false,this._sWriteEx,in_data ,KeyPath);
    }

    this.sWrite_2Ex= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(false,this._sWrite_2Ex,in_data ,KeyPath);
    }

    this.sWriteEx_New= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(false,this._sWriteEx_New,in_data ,KeyPath);
    }

    this.sWrite_2Ex_New= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(false,this._sWrite_2Ex_New,in_data ,KeyPath);
    }

    this.sWrite= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(true,this._sWrite,in_data ,KeyPath);
    }

    this.sWrite_2= function( in_data ,KeyPath)
    {
        return this.SendCmdAndWait(true,this._sWrite_2,in_data ,KeyPath);
    }

    this.sRead= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._sRead,KeyPath);
    }

  
     this.YWriteEx = function(indata,   address,  nlen,  HKey,  LKey,KeyPath) 
    {
        var UK;
	//这里使用了异步的方式，因为WEBSOCKET是异步的
       return new Promise((resolve, reject) => {   

        if (typeof MozWebSocket != "undefined") {
	       UK = new MozWebSocket(url,"usbkey-protocol");
	    } else {
		    UK = new WebSocket(url,"usbkey-protocol");
	    }

	     try
	     {
	        var i=0,order;
	          UK.onopen = function() {

	   	       ResetOrder(UK);//这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
    	   	  
	        } 
    		    
	        UK.onmessage =function got_packet(Msg) 
	        {
	            var UK_Data = JSON.parse(Msg.data);
	            var return_value;
	            if(UK_Data.type!="Process")return ;//如果不是流程处理消息，则跳过
	            if(UK_Data.order<nlen)
	            {
	              _SetBuf(UK,indata[UK_Data.order],UK_Data.order);
	              return;
	            }
	           else{
	              order=UK_Data.order-nlen;
	           }
	            
	            switch(order) 
	            {
	                case 0:
	                    {
	                       LastError=UK_Data.LastError;
	                      if( LastError!=0){ UK.close();resolve(UK_Data.return_value);return ;  } 
	                      _YWriteEx(UK,address,  nlen,  HKey,  LKey,KeyPath); 
	                    }
	                    break; //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
	                case 1:
	                    {
	                        LastError=UK_Data.LastError;
	                        return_value=UK_Data.return_value;
	                        if( LastError!=0){
	                           return_value=LastError;
	                         } 
	                         //所有工作处理完成后，关掉Socket
						     UK.close();
    						 
						     resolve(return_value);
	                    }
	                    break;
                }
	        } 
	        UK.onclose = function(){

             }
             UK.onerror = (event) => {
                 alert('未能连接服务程序，请确定服务程序是否安装。');
             };
	      }
	     catch(e)  
	      {  
				    alert(e.name + ": " + e.message);
				     resolve(false);
	      }  
	    }) 
}
    

    this.YWriteString= function(InString,Address , HKey,  LKey,KeyPath)
    {
        return this.SendCmdAndWait(true,this._YWriteString,InString,Address , HKey,  LKey,KeyPath);
    }

    this.YReadEx= function(address,  nlen,  HKey,  LKey,KeyPath )
    {  
        var outb = new Uint8Array(nlen);
          var UK;
	//这里使用了异步的方式，因为WEBSOCKET是异步的
       return new Promise((resolve, reject) => {   

        if (typeof MozWebSocket != "undefined") {
	       UK = new MozWebSocket(url,"usbkey-protocol");
	    } else {
		    UK = new WebSocket(url,"usbkey-protocol");
	    }
	     try
	     {
	        var i,order;
	          UK.onopen = function() {

	   	       ResetOrder(UK);//这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
    	   	  
	        } 
    		    
	        UK.onmessage =function got_packet(Msg) 
	        {
	            var UK_Data = JSON.parse(Msg.data);
	            var return_value;
	            if(UK_Data.type!="Process")return ;//如果不是流程处理消息，则跳过
	           if(UK_Data.order<2)
	           {
	           
	                switch(UK_Data.order) 
	                {
	                    case 0:
	                        {
	                          _YReadEx(UK,address,  nlen,  HKey,  LKey,KeyPath); 
	                        }
	                        break; //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
	                    case 1:
	                        {
	                            LastError=UK_Data.LastError;
	                            if( LastError!=0){ UK.close();resolve(outb);return ;  } 
						           
						          i=0;
						          _GetBuf(UK,i);//从缓冲区读取YReadEx返回的数据
	                        }
	                        break;
                    }
                  }
                  else{
                      LastError=UK_Data.LastError;
	                  if( LastError!=0){ UK.close();resolve(outb);return ;  } 
                      outb[i]=UK_Data.return_value;
                      i++;
                      if( UK_Data.LastError!=0 || i>=nlen)
                      {
                         UK.close();resolve(outb);return ;
                      }
                       _GetBuf(UK,i);//从缓冲区读取YReadEx返回的数据
                      
                  }
	        } 
	        UK.onclose = function(){

             }
             UK.onerror = (event) => {
                 alert('未能连接服务程序，请确定服务程序是否安装。');
             };
	      }
	     catch(e)  
	      {  
				    alert(e.name + ": " + e.message);
				     resolve(false);
	      }  
	    }) 
		return outb;
    }

    this.YReadString= function( Address,  nlen, HKey,  LKey,KeyPath)
    {
        return this.SendCmdAndWait(false,this._YReadString,Address,  nlen, HKey,  LKey,KeyPath);
    }

    YRead= function(Address,HKey,LKey,Path)
    { 
        return this.SendCmdAndWait(false,this._YRead,Address,HKey,LKey,Path);
    };   
    
    YWrite= function(InData,Address,HKey,LKey,Path)
    { 
         return this.SendCmdAndWait(true,this._YWrite,InData,Address,HKey,LKey,Path)
    }; 

    this.ReSet= function( KeyPath )
    {
        return this.SendCmdAndWait(true,this._ReSet,KeyPath);
    }


    this.SetCal= function( HKey,  LKey,  new_HKey, new_LKey,  KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetCal,HKey,  LKey,  new_HKey, new_LKey,KeyPath);
    }



    this.SetID= function( Seed, KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetID, Seed,KeyPath);
    }

    this.GetProduceDate= function( KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetProduceDate,KeyPath);
    }

    this.SetHidOnly= function( IsHidOnly, KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetHidOnly, IsHidOnly,KeyPath);
    }


    this.SetUReadOnly= function(KeyPath)
    {
        return this.SendCmdAndWait(true,this._SetUReadOnly,KeyPath);
    }
    
    
     this.StarGenKeyPair = function(KeyPath) 
    {
     var KeyPairInfo={
            GenPriKey:"",
            GenPubKeyX:"",
            GenPubKeyY:"",
        } 
     var UK;
	    //这里使用了异步的方式，因为WEBSOCKET是异步的
       return new Promise((resolve, reject) => {   

        if (typeof MozWebSocket != "undefined") {
	       UK = new MozWebSocket(url,"usbkey-protocol");
	    } else {
		    UK = new WebSocket(url,"usbkey-protocol");
	    }

	     try
	     {
	          UK.onopen = function() {
	   	       ResetOrder(UK);//这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
	        } 
    		    
	        UK.onmessage =function got_packet(Msg) 
	        {
	            var UK_Data = JSON.parse(Msg.data);
	            var return_value;
	            if(UK_Data.type!="Process")return ;//如果不是流程处理消息，则跳过
	            switch(UK_Data.order) 
	            {
	                case 0:
	                    {
	                      _StarGenKeyPair(UK,KeyPath); 
	                    }
	                    break; //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
	                case 1:
	                    {
	                        LastError=UK_Data.LastError;
	                        if( LastError!=0){UK.close();  resolve(KeyPairInfo);return ;}
                            //获取生成的私钥
                            _GenPriKey(UK);
	                }
	                break;	
                    case 2:
	                    {
	                         LastError=UK_Data.LastError;
	                        if( LastError!=0){UK.close();  resolve(KeyPairInfo);return ;}
                            KeyPairInfo.GenPriKey=UK_Data.return_value;
                            //获取生成的公钥X
	                        _GenPubKeyX(UK);
	                    }
	                    break;	
                    case 3:
	                    {
	                         LastError=UK_Data.LastError;
	                        if( LastError!=0){UK.close();  resolve(KeyPairInfo);return ;} 
	                        KeyPairInfo.GenPubKeyX=UK_Data.return_value;
	                         //获取生成的公钥Y
	                        _GenPubKeyY(UK);
	                    }
	                    break;	
	                  case 4:
	                    {
	                         LastError=UK_Data.LastError;
	                        if( LastError!=0){UK.close();  resolve(KeyPairInfo);return ;} 
	                        KeyPairInfo.GenPubKeyY=UK_Data.return_value;
    	                    
	                        UK.close();  resolve(KeyPairInfo);return ;
	                    }
	                    break;
                    }
	        } 
	        UK.onclose = function(){

             }
             UK.onerror = (event) => {
                 alert('未能连接服务程序，请确定服务程序是否安装。');
             };
	      }
	     catch(e)  
	      {  
				    alert(e.name + ": " + e.message);
				     resolve(false);
	      }  
	    }) 
    }

    

    this.Set_SM2_KeyPair= function(PriKey, PubKeyX, PubKeyY, SM2_UserName, KeyPath)
    {
        return this.SendCmdAndWait(true,this._Set_SM2_KeyPair,PriKey, PubKeyX, PubKeyY, SM2_UserName,KeyPath);
    }

    this.Get_SM2_PubKey= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._Get_SM2_PubKey,KeyPath);
    }

    this.GetPubKeyX= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetPubKeyX,KeyPath);
    }

    this.GetPubKeyY= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetPubKeyY,KeyPath);
    }

    this.GetSm2UserName= function(KeyPath)
    {
        return this.SendCmdAndWait(false,this._GetSm2UserName,KeyPath);
    }

    this.SM2_EncBuf= function( InBuf, inlen, KeyPath)
    {
        return this.SendCmdAndWait(true,this._SM2_EncBuf, InBuf, inlen,KeyPath);
    }

    this.SM2_DecBuf= function( InBuf, inlen, pin, KeyPath)
    {
        return this.SendCmdAndWait(true,this._SM2_DecBuf,InBuf, inlen, pin, KeyPath);
    }

    this.SM2_EncString= function(InString,  KeyPath)
    {
        return this.SendCmdAndWait(false,this._SM2_EncString,InString, KeyPath);
    }

    this.SM2_DecString= function(InString,  pin, KeyPath)
    {
        return this.SendCmdAndWait(false,this._SM2_DecString,InString,  pin,KeyPath);
    }

    this.YtSetPin= function(old_pin, new_pin, KeyPath)
    {
        return this.SendCmdAndWait(true,this._YtSetPin,old_pin, new_pin, KeyPath);
    }


    this.YtSign= function(msg,  pin,  KeyPath)
    {
        return this.SendCmdAndWait(false,this._YtSign,msg,  pin,  KeyPath);
    }

    this.YtSign_2= function(msg,  pin,  KeyPath)
    {
        return this.SendCmdAndWait(false,this._YtSign_2,msg,  pin,  KeyPath);
    }

    this.MacAddr= function()
    {
        return this.SendCmdAndWait(false,this._MacAddr);
    }
    
    this.ComputerName= function()
    { 
       return this.SendCmdAndWait(false,this._ComputerName);
    }; 
    
       this.SubCal = function(Fun,Inbuf,KeyPath) 
    {
        var UK;var outb = new Uint8Array(8);
	//这里使用了异步的方式，因为WEBSOCKET是异步的
       return new Promise((resolve, reject) => {   

        if (typeof MozWebSocket != "undefined") {
	       UK = new MozWebSocket(url,"usbkey-protocol");
	    } else {
		    UK = new WebSocket(url,"usbkey-protocol");
	    }
	     try
	     {
	        var i=0,order;var bIsEnc=true;
	          UK.onopen = function() {
	   	       ResetOrder(UK);//这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
    	   	  
	        } 
    		    
	        UK.onmessage =function got_packet(Msg) 
	        {
	            var UK_Data = JSON.parse(Msg.data);
	            var return_value;
	            if(UK_Data.type!="Process")return ;//如果不是流程处理消息，则跳过
	            if(bIsEnc)
	            {
	                if(UK_Data.order<8)
	                {
	                  _SetEncBuf(UK,Inbuf[UK_Data.order],UK_Data.order);
	                  return;
	                }
	               else{
	                  order=UK_Data.order-8;
	               }
    	            
	                switch(order) 
	                {
	                    case 0:
	                        {
	                           LastError=UK_Data.LastError;
	                           if( LastError!=0){UK.close(); resolve(outb);return ;} 
	                           Fun(UK, KeyPath); 
	                        }
	                        break; //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
	                    case 1:
	                        {
	                            LastError=UK_Data.LastError;
	                            return_value=UK_Data.return_value;
	                            if( LastError!=0){UK.close(); resolve(outb);return ;} 
	                             bIsEnc=false;i=0;
	                             ResetOrder(UK);
						         
	                        }
	                        break;
                    }
                }
                else{
                      LastError=UK_Data.LastError;
                     if( LastError!=0){
                       UK.close();
			           resolve(outb);return ;
                     } 
                    if(UK_Data.order<8)
	                {
	                  if(UK_Data.order>0)
	                  {
	                    outb[i-1]=UK_Data.return_value;
	                  }
	                  _GetEncBuf(UK,i);//从缓冲区读取YReadEx返回的数据
	                   i++;
	                }
	                else{
	                 outb[i-1]=UK_Data.return_value;
	                 UK.close();
					  resolve(outb);return ;
	                }
                }
	        } 
	        UK.onclose = function(){

             }
             UK.onerror = (event) => {
                 alert('未能连接服务程序，请确定服务程序是否安装。');
             };
	      }
	     catch(e)  
	      {  
				    alert(e.name + ": " + e.message);
				     resolve(false);
	      }  
	    }) 
}
    
        

} 