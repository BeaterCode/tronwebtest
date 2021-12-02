var pillolaId, useScormScoreAsProgressMeasure, interfaceTechnology, tracingType, skin_swf_file, skin_css_suffix, tracingScore, tracingSCORMCompress, xmlDoc, backGroundColor, FLASH_VERSION, application_title, pillolaBookmarkCode, pillolaBookmarkReq, pillolaBookmarkVend, pillolaFrameworkVersion, pillolaBookmarkCli, selectedLanguage, subtitleAutoShowing = false, SCALE_RATIO = 1, CLOSE_TRACING_CALLED = false, TIMER_SAVE = 0;

jQuery(document).ready(function() {

		/// Moodle APP (or Blister) + iphone = media query responsive nug - workaround
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			if(typeof screen !== 'undefined'){
				if(checkVariableExistence(screen.width)){
					/// try to force media query for iphone screen
					jQuery('div#main').css('max-width', screen.width+'px');
				}
			}
		}
		
			jQuery("#detailDock").hide();
			//toggle the component with class msg_body
			jQuery(".barItem").click(function()
			{
				//jQuery(this).next("#detailDock").slideToggle(450);
				jQuery("#detailDock").slideToggle(450);
			});
		  
			// Exit panel request from BUTTON
			jQuery("#myExit").click(function(event) {
				event.preventDefault();
				if(PILL.settings.tracingType == "BLISTER_SCORM_1.2"){
					parent.goBackToFormerMenu();
				} else {
					closeTrainingSession();
				}				
			});
			
			/// HELP button - DESKTOP TABLET html5 version 
			/// (only from IE10 or better)
			if(!(isIE () && isIE () <= 9)){
				if(!(window.matchMedia("(max-width: 767px)")).matches){
					jQuery(".myHelpButtonDesktop").click(function(event) {
						if(((PILL.settings.helpguide_videopath_html5.split('.').pop()).toLowerCase()) == "mp4"){
							/// Stop all video playing in page
							jQuery('video').trigger('pause');
							var helpVideoTag = '<video autoplay id="helpGuideVideo" controls="" width="800" height="600"><source type="video/mp4" src="'+PILL.settings.helpguide_videopath_html5+'">Your browser does not support the video tag.</video>';
							var helpInitiated = jQuery(".help_video_container").attr("initiated");
							if(helpInitiated == "false"){
								jQuery(".help_video_container").attr("initiated","true");
								jQuery(".help_video_container").html(helpVideoTag);
								$('#myHelpModal').on('hidden.bs.modal', function () {
									jQuery('#helpGuideVideo').trigger('pause');
									//alert("close");
								})
							} else {
								jQuery('#helpGuideVideo').trigger('play');
							}
						} else {
							/// PDF or others
							var win = window.open(PILL.settings.helpguide_videopath_html5, '_blank');
							win.focus();
						}
						
						
						
					});
				}
				
				
				/// HELP button - SMARTPHONE html5 version
				if((window.matchMedia("(max-width: 767px)")).matches){
					jQuery("#helpButtonSmartPhone").click(function(event) {
						if(((PILL.settings.helpguide_videopath_html5.split('.').pop()).toLowerCase()) == "mp4"){						
							var helpPanelOpen = jQuery(".help_video_container_smartphone").attr("panel-open");
							if(helpPanelOpen == "false"){
								/// APERTURA
								/// Stop all video playing in page
								jQuery('video').trigger('pause');
								jQuery('video#helpGuideVideoSmartPhone').trigger("play");
								jQuery(".help_video_container_smartphone").attr("panel-open","true");
							} else {
								/// CHIUSURA
								jQuery('video#helpGuideVideoSmartPhone').trigger("pause");
								jQuery(".help_video_container_smartphone").attr("panel-open","false");
							}
						} else {
							/// PDF or others
							$("#helpButtonSmartPhone").attr("data-target","");
							var win = window.open(PILL.settings.helpguide_videopath_html5, '_blank');
							win.focus();							
						}
					});		
				}				
			}
			
			jQuery(window).bind('beforeunload', function() {
				PILL.tracing.tracer.closeTracing();
				//return 'make alert...';
			}); 
				
			// Retrieve tracing info from settings.xml
			xmlDoc=loadXMLDoc("_settings/settings.xml");
			
			/// ADD Language 
			selectedLanguage = "ITA";
			
			/// subtitleGlobalVar
			if(!(typeof(xmlDoc.getElementsByTagName("subtitleAutoShowing")[0]) === "undefined")){
				if(((xmlDoc.getElementsByTagName("subtitleAutoShowing")[0]).childNodes[0].nodeValue).toUpperCase() == "TRUE"){
					subtitleAutoShowing = true;
				}
			}			

			/// try do retrieve specific language for general settings:
			var urlForGeneralSettings = "_frameworks/xmlContentsGeneralSettings_"+selectedLanguage +".xml";
			/// Force language for APP compatibility:
			xmlGeneralSettingsDoc=loadXMLDoc(urlForGeneralSettings);
                       
                       
			if(xmlDoc.getElementsByTagName("pillolaId")[0] == null){ 
				pillolaId =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaId")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaId = (xmlDoc.getElementsByTagName("pillolaId")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("useScormScoreAsProgressMeasure")[0] == null){ 
				useScormScoreAsProgressMeasure =  (xmlGeneralSettingsDoc.getElementsByTagName("useScormScoreAsProgressMeasure")[0]).childNodes[0].nodeValue ;
			} else {
				useScormScoreAsProgressMeasure = (xmlDoc.getElementsByTagName("useScormScoreAsProgressMeasure")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("interfaceTechnology")[0] == null){ 
				interfaceTechnology =  (xmlGeneralSettingsDoc.getElementsByTagName("interfaceTechnology")[0]).childNodes[0].nodeValue ;
			} else {
				interfaceTechnology = (xmlDoc.getElementsByTagName("interfaceTechnology")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("tracingType")[0] == null){ 
				tracingType =  (xmlGeneralSettingsDoc.getElementsByTagName("tracingType")[0]).childNodes[0].nodeValue ;
			} else {
				tracingType = (xmlDoc.getElementsByTagName("tracingType")[0]).childNodes[0].nodeValue;
			}			
			
			if(xmlDoc.getElementsByTagName("skin_swf_file")[0] == null){ 
				if((xmlGeneralSettingsDoc.getElementsByTagName("skin_swf_file")[0] != null)&&(typeof(xmlGeneralSettingsDoc.getElementsByTagName("skin_swf_file")[0].childNodes[0]) != "undefined")){
					skin_swf_file =  (xmlGeneralSettingsDoc.getElementsByTagName("skin_swf_file")[0]).childNodes[0].nodeValue ;
				} else { skin_swf_file =  "pillola.swf" ; }
			} else {
				skin_swf_file = (xmlDoc.getElementsByTagName("skin_swf_file")[0]).childNodes[0].nodeValue;
			}			
			 
			if(xmlDoc.getElementsByTagName("skin_css_suffix")[0] == null){ 
				if(((xmlGeneralSettingsDoc.getElementsByTagName("skin_css_suffix")[0]) != null) && (typeof(xmlGeneralSettingsDoc.getElementsByTagName("skin_css_suffix")[0].childNodes[0]) != "undefined")){
					skin_css_suffix =  (xmlGeneralSettingsDoc.getElementsByTagName("skin_css_suffix")[0]).childNodes[0].nodeValue ;
				} else { skin_css_suffix = ""; }
			} else {
				if((xmlDoc.getElementsByTagName("skin_css_suffix")[0]).childNodes[0] != null){
					skin_css_suffix = (xmlDoc.getElementsByTagName("skin_css_suffix")[0]).childNodes[0].nodeValue;
				} else { skin_css_suffix = ""; }
			}			
			
			if(xmlDoc.getElementsByTagName("tracingScore")[0] == null){ 
				tracingScore =  (xmlGeneralSettingsDoc.getElementsByTagName("tracingScore")[0]).childNodes[0].nodeValue ;
			} else {
				tracingScore = (xmlDoc.getElementsByTagName("tracingScore")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("tracingSCORMCompress")[0] == null){ 
				tracingSCORMCompress =  (xmlGeneralSettingsDoc.getElementsByTagName("tracingSCORMCompress")[0]).childNodes[0].nodeValue ;
			} else {
				tracingSCORMCompress = (xmlDoc.getElementsByTagName("tracingSCORMCompress")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("backgroundColorFlash")[0] == null){ 
				backGroundColor =  (xmlGeneralSettingsDoc.getElementsByTagName("backgroundColorFlash")[0]).childNodes[0].nodeValue ;
			} else {
				backGroundColor = (xmlDoc.getElementsByTagName("backgroundColorFlash")[0]).childNodes[0].nodeValue;
			}
			
			//ADD some for 5.2 debug info
			
			if(xmlDoc.getElementsByTagName("application_title")[0] == null){ 
				application_title =  (xmlGeneralSettingsDoc.getElementsByTagName("application_title")[0]).childNodes[0].nodeValue ;
			} else {
				application_title = (xmlDoc.getElementsByTagName("application_title")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("pillolaBookmarkCode")[0] == null){ 
				pillolaBookmarkCode =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaBookmarkCode")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaBookmarkCode = (xmlDoc.getElementsByTagName("pillolaBookmarkCode")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("pillolaBookmarkReq")[0] == null){ 
				pillolaBookmarkReq =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaBookmarkReq")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaBookmarkReq = (xmlDoc.getElementsByTagName("pillolaBookmarkReq")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("pillolaBookmarkVend")[0] == null){ 
				pillolaBookmarkVend =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaBookmarkVend")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaBookmarkVend = (xmlDoc.getElementsByTagName("pillolaBookmarkVend")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("pillolaBookmarkCli")[0] == null){ 
				pillolaBookmarkCli =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaBookmarkCli")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaBookmarkCli = (xmlDoc.getElementsByTagName("pillolaBookmarkCli")[0]).childNodes[0].nodeValue;
			}
			
			if(xmlDoc.getElementsByTagName("pillolaFrameworkVersion")[0] == null){ 
				pillolaFrameworkVersion =  (xmlGeneralSettingsDoc.getElementsByTagName("pillolaFrameworkVersion")[0]).childNodes[0].nodeValue ;
			} else {
				pillolaFrameworkVersion = (xmlDoc.getElementsByTagName("pillolaFrameworkVersion")[0]).childNodes[0].nodeValue;
			}
			
			
			
		//IE8 fix for license type
		//Automatically Disable License for IE8 becaus it crash on encryption libraries
		// is IE version less than 9
		if (isIE () && isIE () < 9) { pillolaBookmarkReq = "ALONEPC"; }

			
		//Dinamically get tracingLayer file by settings tracing type	
		switch(tracingType)
			{
			case "COOKIES":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_cookies.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "SCORM_1.2":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_scorm12.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "MOODLE":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_moodle.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "BLISTER_SCORM_1.2":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_scormBlister12.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "SCORM_2004":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_scorm2004.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "POST":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_post.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			case "XAPI":			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_xapi.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				break;
			
			default:			
				if (typeof someObject == 'undefined') $.loadScript('_frameworks/_tracing/tracingLayer_none.js', function(){   checkBrowserToChooseTechnology(interfaceTechnology);		});
				jQuery(".tracker").hide();
				break;
			}
			
});

function checkBrowserToChooseTechnology(interfaceTechnology){
		//Technology questions
		//alert("interfaceTechnology: " + interfaceTechnology);
		if(interfaceTechnology === "FLASH"){ 
			if( getParameterByName("mobile") == "force"){
				// even the interfaceTechnology is set to FLASH we keep play HTML5 version because is forced via URL
				alert("Sorry, no mobile content is supplied for this Pill");
				hidePillInterface();
				return;
			} else {
				if(checkIfFlashPluginIsPresent()){ 
					// OK, plugin present, we go Flash...
					goDesktopVersion(); 
				} else {
					// Tell user we need Flash
					alert("Sorry, you need to install Flash plugin 10.3 o greater in order to view this Pill ");
					hidePillInterface();
					return;
				}
			}
			
		} else if(interfaceTechnology === "HTML5") {
			if(!(checkIfHtml5SupportIsPresent())){
					alert("Sorry, you need a HTML5 browser in order to view this Pill ");
					hidePillInterface();
					return;
			} else {
				// else : HTML5 support: OK! let's go HTML5 mode (do nothing)
				if( getParameterByName("mobile") == "force"){
					// If you force mobile on a HTML5 only pill we warn you it's unecessary
					alert("You don't need to force mobile, HTML5 is already set in settings.xml");
				} 
				goMobileVersion();
			} 
		} else if(interfaceTechnology === "HYBRID") {

				// If no FLASH and no HTML5 the Pill should not play at all (hide Interface)
				if(!(checkIfFlashPluginIsPresent()) && !(checkIfHtml5SupportIsPresent())){
					alert("It seems you don't have the FLASH plugin neither a HTML5 browser. You are NOT able to play the Pill properly! :( ");
					hidePillInterface();
					return;
				} else {
				
					if(getParameterByName("mobile") == "force"){
						if(!checkIfHtml5SupportIsPresent()){
							alert("Sorry, you need a HTML5 browser in order to view this version of the Pill ");
							hidePillInterface();
							return;
						} else {
							goMobileVersion();
						}
					} else {
						// If flash plugin is present is Pill is playing FLASH mode
						if(checkIfFlashPluginIsPresent()){ goDesktopVersion();} 
						else { 
							// If flash plugin is NOT present and the broswer is HTML5 (usually mobile) the HTML5  Pill is playing HTML5 mode
							goMobileVersion();
						}
					}
					

				}				

		} else if(interfaceTechnology === "HYBRID_HTML5_FIRST") {
				// If no FLASH and no HTML5 the Pill should not play at all (hide Interface)
				if(!(checkIfFlashPluginIsPresent()) && !(checkIfHtml5SupportIsPresent())){
					alert("It seems you don't have the FLASH plugin neither a HTML5 browser. You are NOT able to play the Pill properly! :( ");
					hidePillInterface();
					return;
				} else {
					// if it's mobile browser, let's go mobile
					if(checkIfHtml5SupportIsPresent()){ goMobileVersion();} 
					else { 
						// if it's not HTML5 browser then we can go FLASH!
						goDesktopVersion();
					}
				}				
		} else {
			alert("invalid interfaceTechnology selected :(");
		}

		
}



	function goMobileVersion(){
		FLASH_VERSION = false;
		/// auto play guide?
		jQuery('.carousel').carousel("pause");
		/// scale? rember to handle d&d plus video play on click
		//scaleToFitBiggerScreen();
		PILL.init();
		/// Style Icon color:
		checkForIconsColor();			
	}

	function goDesktopVersion(){
		FLASH_VERSION = true;
		justInitTracingLayer();
		//PILL.init();
		//Add the flash object to the page
		jQuery("#loading").hide();
		jQuery(".headerDivider").hide();
		jQuery(".contentArea").hide();
		jQuery(".footerDivider").hide();
		jQuery("body").css("height","100%");
		jQuery("body").css("overflow","hidden");
		jQuery("html").css("height","100%");
		jQuery("html").css("overflow","hidden");
		jQuery("body").css("text-align","center");
		jQuery("body").css("background",backGroundColor);		
	}

	function embedSWF(){
		/*<![CDATA[ */
			swfobject.embedSWF('c.swf?settingsPath=settings.xml&flashEngine='+skin_swf_file, 'website', '100%', '100%', '10.3', 
				'swfobject/expressinstall.swf', {domain: '*'}, {allowscriptaccess: 'always', bgcolor: backGroundColor, menu: 'false', wmode: 'opaque', allowfullscreen :'true'}, {id: 'website'});
		/* ]]>*/		
	}
	
	
	function justInitTracingLayer(){
		PILL.tracing = {
            enabled: false,
            tracer: null,
            info: null,
            pillStatus: null
        };
		
		// jQuery.get('_settings/settings.xml', settingsLoadedDesktop);
		settingsLoadedDesktop(xmlDoc);
	}

	
function settingsLoadedDesktop(data)
    {

        var json = $.xml2json(data);
		var jsonGeneral = $.xml2json(xmlGeneralSettingsDoc);
        PILL.settings = json;
        if (pillDebugMode) {
            var str = JSON.stringify(json, this);
            debugWrite(str, "blue")
        }

		// TRACKING LABELS FROM GENERAL SETTINGS
		if(typeof PILL.settings.tracking === "undefined"){
			PILL.settings.tracking = jsonGeneral.tracking;
		}

		
		// MENU ITEM LABELS FROM GENERAL SETTINGS
		if (typeof PILL.settings.menu.menuItem.length != 'undefined') {
			$.each(PILL.settings.menu.menuItem, function (menuIndex, menu) {
				//if (menu.isForSmallDevice) tmpArr.push(menu);
				//console.log("menuIndex: " + menuIndex + " menu.label_flash: " + menu.label_flash);
				if(typeof menu.label_flash === "undefined"){
					//console.log("menu.type: " + menu.type);
					//console.log("getting from GENERAL: menu.label_flash: " + (jsonGeneral[menu.type]).label_flash  );
					menu.label = (jsonGeneral[menu.type]).label_flash;
				} else {
					menu.label = menu.label_flash;
				}
			});
		} else {
			//alert("PILL.settings.menu.menuItem.label_flash: " + PILL.settings.menu.menuItem.label_flash);
			if(typeof PILL.settings.menu.menuItem.label_flash === "undefined"){
				PILL.settings.menu.menuItem.label = (jsonGeneral[PILL.settings.menu.menuItem.type]).label_flash;
			} else {
				PILL.settings.menu.menuItem.label = PILL.settings.menu.menuItem.label_flash;
			}			
		}
		
        //set menu items for small device
        //alert(PILL.isSmallDevice);
        if (PILL.isSmallDevice) {
            var tmpArr = new Array();

            $.each(PILL.settings.menu.menuItem, function (menuIndex, menu) {
                if (menu.isForSmallDevice) tmpArr.push(menu);
            });
            PILL.settings.menu.menuItem = tmpArr;
            //alert(tmpArr.length);
        }

        //init tracing
        TRACING_TYPE = tracingType;
		if(tracingSCORMCompress === "true"){ TRACING_COMPRESS = true; } else { TRACING_COMPRESS = false; }
		if(PILL.settings.onePillCourse === "false"){ ONE_PILL_COURSE = false; } else { ONE_PILL_COURSE = true; }
		if(PILL.settings.debug === "false"){ FF_CONSOLE_DEBUG = false; } else { FF_CONSOLE_DEBUG = true; }
		
		USE_SCORM_SCORE_AS_PROGRESS_MEASURE = useScormScoreAsProgressMeasure;
		if(USE_SCORM_SCORE_AS_PROGRESS_MEASURE === "true"){ USE_SCORM_SCORE_AS_PROGRESS_MEASURE = true; } else { USE_SCORM_SCORE_AS_PROGRESS_MEASURE = false; }
        PILL.tracing.enabled = (TRACING_TYPE != "NONE");
        PILL.pillId = pillolaId;
        PILL.tracing.tracer = new TracingLayer();
        PILL.tracing.info = PILL.tracing.tracer.GET_PillolaInitInfo(pillolaId);
		//debugOnConsole("PILL.tracing.info:: " + PILL.tracing.info.menu_01 );
        //***********
		
		//update progress + init info:
        var sumPills = 0;
        
		if(!PILL.settings.menu.menuItem.length){ 
			//Single object Pill
			if (PILL.tracing.enabled) {
				tracingObjectStatus = PILL.tracing.tracer.GET_ObjectStatus(pillolaId, 0);

				switch (tracingObjectStatus) {

					case "incomplete":
						PILL.visitedItems[0] = 0;
						break;
					case "completed":
						PILL.visitedItems[0] = 1;
						break;
					default:
						PILL.visitedItems[0] = -1;
						break;
				}
			}			
		
		} else {

				//Multi object Pill
			$.each(PILL.settings.menu.menuItem, function (menuIndex, menu) {
				//tracing: imposto visited items in base a tracing
				if (PILL.tracing.enabled) {

					tracingObjectStatus = PILL.tracing.tracer.GET_ObjectStatus(pillolaId, menuIndex);
					switch (tracingObjectStatus) {

						case "incomplete":
							PILL.visitedItems[menuIndex] = 0;
							break;
						case "completed":
							PILL.visitedItems[menuIndex] = 1;
							break;
						default:
							PILL.visitedItems[menuIndex] = -1;
							break;
					}
				}
			   
			});
		
		}

        for(var i=0;i<PILL.visitedItems.length;i++)
        {
            sumPills += (PILL.visitedItems[i]<0?0:PILL.visitedItems[i]);
        }
        //debugWrite("tot. progress:"+sumPills, "blue");
        var numeroOggettiPillola = PILL.visitedItems.length;
		if(numeroOggettiPillola == 0){ numeroOggettiPillola = 1;}
        var perc = sumPills / numeroOggettiPillola * 100;
		//console.log("sumPills: " + sumPills + " numeroOggettiPillola: " + numeroOggettiPillola + " perc: " + perc + " PILL.pillId: " + PILL.pillId);

        if (PILL.tracing.enabled) { PILL.tracing.tracer.SET_PillolaProgressPercentage(PILL.pillId, perc); }
		
		provideBookmarks();
    }	
	
	
	
	function loadXMLDoc(filename)	{
		if (window.XMLHttpRequest) {  xhttp=new XMLHttpRequest();  }
		else {  xhttp=new ActiveXObject("Microsoft.XMLHTTP");  } // code for IE5 and IE6
		xhttp.open("GET",filename,false);
		xhttp.send();
		return xhttp.responseXML;
	}

	
	function closeTrainingSession(){
		jQuery(".headerDivider").hide();
		jQuery(".contentArea").hide();
		jQuery(".footerDivider").hide();
		$('#myModal').modal({ backdrop: 'static', keyboard: false });
		jQuery(".close").hide();
		PILL.tracing.tracer.closeTracing();
		if((PILL.settings.tracingType == "POST") || (PILL.settings.tracingType == "SKILLA")){
			 //window.close();
			 setTimeout(function(){ window.close(); }, 3000);
		}		
	}

	
	window.checkIfFlashPluginIsPresent = function() {
		var hasFlash = false;
		try {
		  var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		  if (fo) { hasFlash = true;  }
		} catch (e) {
			if (	navigator.mimeTypes
					&& navigator.mimeTypes['application/x-shockwave-flash'] != undefined
					&& navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {	hasFlash = true;  }
		}
		//return false; 
		//return true; 
		return hasFlash; 
	}		

	window.checkIfHtml5SupportIsPresent = function() {
		//if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { check = true; }	// this mobile
		var test_canvas = document.createElement("canvas") //try and create sample canvas element
		var canvascheck=(test_canvas.getContext)? true : false //check if object supports getContext() method, a method of the canvas element
		//return false; 
		//return true; 
		return canvascheck; 
	}

	window.hidePillInterface = function() {
		//alert("hidePillInterface");
		jQuery("#main").hide();
		jQuery("#website").hide();
	}
	
	jQuery.loadScript = function (url, callback) {
		jQuery.ajax({
			url: url,
			dataType: 'script',
			success: callback,
			async: true
		});
	}	
	
	
// CHEATING with COMPLETION Easter Egg
// 65, 67, 80

var keyPressed = [];
var already_cheated = false;
var map = {68: false, 69: false, 86: false};
$(document).keydown(function(e) {
	if(! isElementPresentInArrayForCheat(e.keyCode,keyPressed)){
		keyPressed.push(e.keyCode);
	}
	//console.log(keyPressed);
	if(checkForRightCheating()){
		forceCheatCompletion();
	}
}).keyup(function(e) {
	if(isElementPresentInArrayForCheat(e.keyCode,keyPressed)){
		keyPressed = removeElementFromKeyPressed(e.keyCode,keyPressed);
	}
	//console.log(keyPressed);
});


function checkForRightCheating(){
	if((keyPressed.length == 3)
		&&(isElementPresentInArrayForCheat(65,keyPressed))
		&&(isElementPresentInArrayForCheat(67,keyPressed))
		&&(isElementPresentInArrayForCheat(80,keyPressed)))
	{ return true; }
	else { return false; }
}
	
function forceCheatCompletion(){
	if(already_cheated){return;}
	already_cheated = true;
	debugOnConsole("CHEATING:::: ok force completion");
	
	$.each(PILL.settings.menu.menuItem, function(menuIndex, menu)
	{
		/// Objects
		PILL.tracing.tracer.SET_ObjectStatus(PILL.pillId.toString(), menuIndex.toString(), "completed");
		/// Units
		if(menu.type == "ls_swf"){ completeAllUnitsInThisLs(PILL.pillId.toString(), menuIndex, menu); }
	});	
	
	PILL.tracing.tracer.SET_PillolaStatus(PILL.pillId.toString(), 'completed');
	updateProgress();

}
	
function completeAllUnitsInThisLs(pillId, menuIndex, menu){
	var lsXml = removeDoubleSlashesFromUrlHere(menu.folder+"/"+menu.xmlContentFile);
	jQuery.get(lsXml, function(xml){
		var lsOpt = jQuery.xml2json(xml);
		$.each(lsOpt.menu.menuItem, function(LSmenuIndex, LSmenu)
		{
			//console.log("pillId: "+pillId+" menuIndex: "+menuIndex+" LSmenu.id: " + LSmenu.id);
			PILL.tracing.tracer.SET_LSobjStatus(pillId, menuIndex, LSmenu.id, "completed");
		});			
		
	});	
	
}

function removeDoubleSlashesFromUrlHere(actualUrl){
	actualUrl = actualUrl.replace(/\/\/+/g, "/");
	return(actualUrl);
}

	
function isElementPresentInArrayForCheat(elementToLookFor, arryToCheck){
	var i;
	for(i=0;i<arryToCheck.length;i++){
		if(arryToCheck[i] == elementToLookFor){ return(true); }
	}
	return(false);
}	
	
function removeElementFromKeyPressed(elementToLookFor, arryToCheck){
	var i;
	for(i=0;i<arryToCheck.length;i++){
		if(arryToCheck[i] == elementToLookFor){ 
			arryToCheck.splice(i, 1);
			return(arryToCheck); 
		}
	}
}	
	
function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}	



function scaleToFitBiggerScreen(){
	/// scale support
	if(!(getSupportedTransform() )){ SCALE_RATIO = 1; return;}
	
	var scaleRatioX = Math.round(($(document).width() * 1000) / 830) / 1000;
	var scaleRatioY = Math.round(($(document).height() * 1000) / 680) / 1000;
	SCALE_RATIO = scaleRatioX;
	if(scaleRatioY < scaleRatioX){ SCALE_RATIO = scaleRatioY; }
	
	/// scale only to bigger
	if(SCALE_RATIO < 1.01) { SCALE_RATIO=1; return;}
	
	var scaleX = SCALE_RATIO;
	var scaleY = SCALE_RATIO;
	var moveYnumber = Math.round(((($('#main').height()) * SCALE_RATIO) - ($('#main').height())) / 2) ;
	var moveY = moveYnumber + 'px';
	
	$('body').css('zoom', ' ' + SCALE_RATIO*100 + '%');	
	//document.body.style.zoom="150%"
	
	/*
	$('#main').css({
	  '-webkit-transform' : 'scale('+scaleX+','+scaleY+') translateY('+moveY+')',
	  '-moz-transform'    : 'scale('+scaleX+','+scaleY+') translateY('+moveY+')',
	  '-ms-transform'     : 'scale('+scaleX+','+scaleY+') translateY('+moveY+')',
	  '-o-transform'      : 'scale('+scaleX+','+scaleY+') translateY('+moveY+')',
	  'transform'         : 'scale('+scaleX+','+scaleY+') translateY('+moveY+')'
	});
	*/
	
}

function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    var div = document.createElement('div');
    for(var i = 0; i < prefixes.length; i++) {
        if(div && div.style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
}

function checkForDoubleSuffix(originalFileName, SuffixFileName, suffix){
	var originalSuffix = originalFileName.substr(originalFileName.length - suffix.length);
	if(originalSuffix == suffix){ return(true); }
	return(false);
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
	var fileFound = false;
	//if(http.status != 404){ fileFound = true; }
	if((http.status == 200)||(http.status == 304)||(http.status == "Finished")){ fileFound = true; }
	//alert("url:: " + url + " file Found:: " + fileFound);
    return(fileFound);
}

function checkVariableExistence(obj,path){
	if (!obj) return false;           // no object, return false
	if (obj && !path) return true; 	  // has object, no path, return obj
	
	var props = path.split(".");
	var currentObject = obj;	
	
	for (var i = 0; i < props.length; ++i) {
		///store the next property, evaluate and break out if it's undefined
		currentObject = currentObject[props[i]];
		//console.log(String(props[i]));
		//if (!currentObject) return false;
		if (!(typeof currentObject !== 'undefined'))return false;
	}

	/// If the loop did not break until the last path, then the path exists
	//console.log("var existsss");
	return true;	
}


function styleWhiteIconsWithColor(className, colorToSet){
	jQuery('img'+className).each(function(){
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		jQuery.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');

			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');

	});			
	
	var style = jQuery('<style>svg'+className+' path.st1{ fill: '+colorToSet+'; } </style>');
	jQuery('html > head').append(style);			
		
}

function checkForIconsColor(){
	
	var hamburgerIconColor = "#FFF";
	if(xmlDoc.getElementsByTagName("hamburgerIconColor")[0] == null){ 
		if(xmlGeneralSettingsDoc.getElementsByTagName("hamburgerIconColor")[0] != null){
			hamburgerIconColor =  (xmlGeneralSettingsDoc.getElementsByTagName("hamburgerIconColor")[0]).childNodes[0].nodeValue ;
		}
	} else {
		if(xmlDoc.getElementsByTagName("hamburgerIconColor")[0] != null){
			hamburgerIconColor = (xmlDoc.getElementsByTagName("hamburgerIconColor")[0]).childNodes[0].nodeValue;
		}
	}	
	styleWhiteIconsWithColor(".icon_hamburger", hamburgerIconColor );
	
	var helpButtonIconColor = "#FFF";
	if(xmlDoc.getElementsByTagName("helpButtonIconColor")[0] == null){ 
		if(xmlGeneralSettingsDoc.getElementsByTagName("helpButtonIconColor")[0] != null){
			helpButtonIconColor =  (xmlGeneralSettingsDoc.getElementsByTagName("helpButtonIconColor")[0]).childNodes[0].nodeValue ;
		}
	} else {
		if(xmlDoc.getElementsByTagName("helpButtonIconColor")[0] != null){
			helpButtonIconColor = (xmlDoc.getElementsByTagName("helpButtonIconColor")[0]).childNodes[0].nodeValue;
		}
	}	
	styleWhiteIconsWithColor(".myHelpButton", helpButtonIconColor );	

}
