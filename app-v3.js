(function(){
'use strict';
var KEY='letter-log-maker-offline-v3',OLD='letter-log-maker-offline-v2';
var defaultBody='<p>라 만차의 어느 마을에, 그 이름은 굳이 기억하고 싶지 않지만, 그리 오래지 않은 옛날 한 이달고가 살고 있었다. 무기걸이에 창 하나, 낡은 가죽 방패 하나, 비쩍 마른 말 한 필과 잘 달리는 사냥개 한 마리를 가진 부류의 이달고였다.</p><p>그의 집에는 마흔을 넘긴 가정부 하나와 스물을 채 넘기지 않은 조카딸 하나가 있었고, 들일이든 바깥일이든 가리지 않는 젊은 하인 하나가 있었다. 우리 이달고의 나이는 쉰 살에 가까웠다. 체질은 단단했으나 몸에는 살이 없었고 얼굴은 야위었으며, 아침 일찍 일어나는 사람이었고 사냥을 좋아했다.</p><p>그런데 이 이달고는 한가할 때면 기사도 소설을 읽는 데 그토록 열성적으로 빠져든 나머지 사냥은 거의 완전히 잊어버렸고 자기 재산을 돌보는 일마저 등한시했다.</p><p>결국 그는 독서에 너무 깊이 빠져들어 밤이면 날이 밝을 때까지 읽고, 낮이면 날이 저물 때까지 읽곤 했다. 그렇게 잠은 적게 자고 책은 지나치게 많이 읽은 탓에 그의 뇌는 말라버렸고, 마침내 그는 이성을 잃고 말았다.</p><p>그의 상상력은 책에서 읽은 온갖 것으로 가득 찼다. 마법과 싸움, 전투와 결투, 부상, 사랑의 호소와 연애, 폭풍우, 그리고 도저히 있을 수 없는 온갖 황당무계한 일들이었다.</p><p>마침내 그의 이성이 완전히 끝장나자, 그는 자신의 명예를 드높이고 공동체에도 봉사하기 위해 스스로 편력기사가 되는 것이 반드시 필요하다고 생각했다.</p><p>그리하여 갑옷과 무기를 갖추고 말을 타고 온 세상을 떠돌면서 모험을 찾아 나서기로 했다. 책에서 읽은 편력기사들이 했던 모든 일을 자신도 몸소 행하고, 온갖 부당한 일을 바로잡아 영원한 이름과 명성을 얻겠다는 것이었다.</p><p>그는 자기 말을 ‘로시난테’라고 부르기로 했고, 마침내 스스로를 ‘돈 키호테 데 라 만차’라고 불렀다.</p><p>“만일 내가 어디선가 거인 하나를 만나 돌진 한 번으로 그자를 쓰러뜨린다면, 그자를 누구에게 보내 바치게 할 여인이 한 사람쯤 있어야 마땅하지 않겠는가?”</p>';
var defaults={sampleVersion:2,kicker:'MIGUEL DE CERVANTES',issue:'제1부 · 제1장',title:'Don Quixote',titleFont:'playfair',titleAlign:'right',quote:'라 만차의 어느 마을에, 그 이름은 굳이 기억하고 싶지 않지만.',author:'유명하고 용감한 이달고 돈 키호테 데 라 만차',bodyHtml:defaultBody,annotationsVersion:1,annotations:[],bodyFont:'notoserif',bodySize:14,lineHeight:2,letterSpacing:0,paragraphGap:16,textIndent:0,indentEnabled:false,bodyLayout:'full',railWidth:26,railItems:[],railSections:[],railSectionsVersion:1,railImageUrl:'',railTopText:'',railBottomText:'',paperColor:'#f4f1ea',textColor:'#292724',kickerColor:'#58534c',issueColor:'#58534c',quoteColor:'#5a5148',titleColor:'#201f1d',authorColor:'#58534c',footerColor:'#58534c',dialogueColor:'#5a5148',thoughtColor:'#686078',emphasisColor:'#8a4b3e',metaColor:'#58534c',dialogueBold:false,thoughtItalic:true,mobileAnchorWidth:375,heroImageUrl:'',heroHeight:360,heroAspect:56.25,heroOpacity:40,heroZoom:100,heroFocusX:50,heroFocusY:50,gradientMode:'fade',fadeStart:45,fadeEnd:100,fadeStrength:100,overlayMode:'none',overlayColor:'#000000',overlayOpacity:20,showInfo:false,showLogMeta:false,showComment:false,logDate:'',logModel:'',logPrompt:'',logBot:'',logPersona:'',logComment:'',footer:'MIGUEL DE CERVANTES · DON QUIXOTE'};
defaults.storyTitle='';
defaults.storyTitleAlign='left';
defaults.storyTitleFont='body';
defaults.showStoryNumbers=true;
defaults.publicationToggle=false;
defaults.publicationInitialState='closed';
defaults.singleStoryView='contents';
defaults.publicationReadPrompt=true;
defaults.publicationReadPromptText='OPEN TO READ';
defaults.publicationReadPromptFont='arial';
defaults.publicationReadPromptAlign='center';
defaults.publicationReadPromptHeight=96;
var previewPublicationOpen=null;
// A collection keeps the existing single-story editor as its active editing context.
var storyCollection=null,storyRuntime={},storyContextDepth=0,storyReady=false;
// The book has one cover; each story only contributes its contents row and body.
var COVER_FIELDS=['kicker','issue','title','titleFont','titleAlign','quote','author','kickerColor','issueColor','quoteColor','titleColor','authorColor','heroImageUrl','heroHeight','heroAspect','heroOpacity','heroZoom','heroFocusX','heroFocusY','gradientMode','fadeStart','fadeEnd','fadeStrength','overlayMode','overlayColor','overlayOpacity','paperColor','bodyFont','dialogueBold'];
function isCoverSetting(key){return COVER_FIELDS.indexOf(key)>=0&&['paperColor','bodyFont','dialogueBold'].indexOf(key)<0;}
var READING_FIELDS=['showStoryNumbers','singleStoryView','storyTitleAlign','storyTitleFont','publicationToggle','publicationInitialState','publicationReadPrompt','publicationReadPromptText','publicationReadPromptFont','publicationReadPromptAlign','publicationReadPromptHeight'];
var COMMON_FIELDS=['paperColor','textColor','bodyFont','bodySize','lineHeight','letterSpacing','paragraphGap','textIndent','indentEnabled','footer','footerColor','dialogueColor','dialogueBold','thoughtColor','thoughtItalic','emphasisColor','metaColor','showInfo','showLogMeta','showComment','logDate','logModel','logPrompt','logBot','logPersona','logComment','mobileAnchorWidth'];
function normalizeCommonSettings(raw,fallback){
 var data=importedSingleDraft(Object.assign({},defaults,fallback||{},raw&&typeof raw==='object'?raw:{},{bodyHtml:'<p><br></p>',annotations:[],railSections:[],railSectionsVersion:1,railItems:[]})),common={};
 COMMON_FIELDS.forEach(function(key){common[key]=data[key];});return common;
}
function settingOwner(key){
 if(storyCollection&&READING_FIELDS.indexOf(key)>=0)return storyCollection.reading;
 if(storyCollection&&COMMON_FIELDS.indexOf(key)>=0)return storyCollection.common;
 return storyCollection&&storyCollection.cover&&isCoverSetting(key)?storyCollection.cover:draft;
}
function normalizeReading(raw,fallback){
 var data=Object.assign({},defaults,fallback||{},raw&&typeof raw==='object'?raw:{}),reading={};
 normalizePublicationToggle(data);data.storyTitleAlign=contentsAlign(data.storyTitleAlign);
 READING_FIELDS.forEach(function(key){reading[key]=data[key];});return reading;
}
// Mirror common presentation into legacy story drafts for the existing renderer.
function applyCommonSettings(collection){
 collection.stories.forEach(function(story){READING_FIELDS.forEach(function(key){story.data[key]=collection.reading[key];});COMMON_FIELDS.forEach(function(key){story.data[key]=collection.common[key];});});
}

function normalizeSharedCover(raw,fallback){
 var source=Object.assign({},fallback||defaults,raw&&typeof raw==='object'?raw:{}),cover={};
 source.bodyHtml='<p><br></p>';source.railSections=[];source.railSectionsVersion=1;source.railItems=[];source.annotations=[];
 source=importedSingleDraft(source);COVER_FIELDS.forEach(function(key){cover[key]=source[key];});return cover;
}
function sharedCoverStory(){
 return{id:'story-shared-cover',data:Object.assign({},defaults,storyCollection.cover,{bodyHtml:'<p><br></p>',annotations:[],railItems:[],railSections:[],railSectionsVersion:1,publicationToggle:false,mobileAnchorWidth:activeStory().data.mobileAnchorWidth})};
}
function sharedCoverHtml(forPreview){return withStoryContext(sharedCoverStory(),null,function(){return singleStoryHtml(forPreview,'cover');});}
function contentsAlign(value){return /^(left|center|right)$/.test(value)?value:'left';}
function contentsFontKey(value){return value===undefined||value===null||value==='cover'?'cover':safePublicationPromptFont(value);}
function contentsFontSpec(value){return contentsFontKey(value)==='cover'?{family:bodyFontFamily(storyCollection.cover.bodyFont),style:'normal'}:publicationPromptFontSpec(value);}
function normalizeContents(raw){var data=raw&&typeof raw==='object'?raw:{};return{text:data.text===undefined?'목차':String(data.text),align:contentsAlign(data.align),font:contentsFontKey(data.font),enabled:data.enabled!==false};}
function hasStoryContents(){return !!(storyCollection&&storyCollection.stories.length>1);}
function isLastStoryData(data){return !storyCollection||storyCollection.stories[storyCollection.stories.length-1].data===data;}
function isSingleCoverView(){return !!(storyCollection&&storyCollection.stories.length===1&&storyCollection.reading.publicationToggle&&storyCollection.reading.singleStoryView==='cover');}
function contentsHeadingHtml(forPreview){
 var cover=storyCollection.cover,contents=normalizeContents(storyCollection.contents),font=contentsFontSpec(contents.font);
 if(!contents.enabled||isSingleCoverView())return'';
 return '<div style="box-sizing:border-box;padding:36px 4.167% 20px;background-color:'+cover.paperColor+';font-family:'+font.family+';font-style:'+font.style+';font-size:18px;font-weight:700;line-height:1.4;letter-spacing:-.025em;text-align:'+contents.align+';word-break:keep-all;overflow-wrap:anywhere;color:'+cover.titleColor+';"><div'+(forPreview?' data-contents-title="true"':'')+'>'+escapeHtml(contents.text)+'</div></div>';
}

function usesCollectionCredit(){return !!storyCollection.reading.publicationToggle;}
function collectionFooterHtml(forPreview){
 if(!usesCollectionCredit())return hasStoryContents()?'<div style="height:48px;background-color:'+storyCollection.common.paperColor+';font-size:0;line-height:0;">&nbsp;</div>':'';
 return '<div'+(forPreview?' data-collection-credit="true"':'')+' style="display:table;box-sizing:border-box;width:100%;height:48px;margin:0;background-color:'+storyCollection.common.paperColor+';"><span style="display:table-cell;padding:0 4.167% 16px;vertical-align:bottom;text-align:right;font-family:Arial,sans-serif;font-size:10px;line-height:12px;font-weight:400;letter-spacing:2px;color:'+storyCollection.common.metaColor+';">LETTER LOG</span></div>';
}

function storyHeadingHtml(forPreview){
 var index=storyCollection.stories.findIndex(function(story){return story.data===draft;}),number=String(Math.max(0,index)+1).padStart(2,'0');
 var font=publicationPromptFontSpec(draft.storyTitleFont),compactPrompt=hasStoryContents()&&draft.publicationToggle&&draft.publicationReadPrompt;
 var numberHtml=draft.showStoryNumbers?'<span'+(forPreview?' data-story-number="true"':'')+' style="display:inline-block;margin-right:14px;vertical-align:baseline;font-family:Arial,sans-serif;font-style:normal;font-size:11px;font-weight:600;letter-spacing:.12em;color:'+draft.metaColor+';">'+number+'</span>':'';
 return '<div'+(forPreview?' data-story-heading="true"':'')+' style="box-sizing:border-box;width:100%;padding:24px 4.167% '+(compactPrompt?'0':'24px')+';text-align:'+contentsAlign(draft.storyTitleAlign)+';font-family:'+font.family+';font-size:20px;line-height:1.4;font-style:'+font.style+';font-weight:700;letter-spacing:-.02em;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;color:'+draft.textColor+';">'+numberHtml+escapeHtml(storyTitle({data:draft}))+'</div>';
}
var sharedCoverProbe='',sharedCoverLocalImage='';
function measureSharedCover(){
 var owner=storyCollection.cover,src=sharedCoverLocalImage||normalizeImageSource(owner.heroImageUrl);if(!src||src===sharedCoverProbe)return;sharedCoverProbe=src;
 var probe=new Image();probe.referrerPolicy='no-referrer';probe.onload=function(){if(owner!==storyCollection.cover||src!==sharedCoverProbe||!probe.naturalWidth||!probe.naturalHeight)return;var aspect=clampNumber(Math.round(probe.naturalHeight/probe.naturalWidth*10000)/100,20,180,56.25);if(Math.abs(owner.heroAspect-aspect)>.05){owner.heroAspect=aspect;render();}};
 probe.onerror=function(){if(src===sharedCoverProbe)sharedCoverProbe='';};probe.src=src;
}
function syncSharedCoverControls(){
 fields.forEach(function(field){if(!isCoverSetting(field.dataset.field))return;var value=settingOwner(field.dataset.field)[field.dataset.field];if(document.activeElement!==field)field.value=value===undefined?'':value;});
 document.querySelectorAll('[data-cover-field]').forEach(function(field){if(document.activeElement===field)return;var value=storyCollection.cover[field.dataset.coverField];if(field.type==='checkbox')field.checked=!!value;else field.value=value;});
}

function newStoryId(){return 'story-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);}
function cloneStoryData(data){return JSON.parse(JSON.stringify(data));}
function normalizeStoryCollection(raw){
 if(!raw||!Array.isArray(raw.stories)||!raw.stories.length)throw new Error('invalid stories');
 var ids={},stories=raw.stories.map(function(record){
  if(!record||!record.data)throw new Error('invalid story');
  var id=/^story-[a-z0-9_-]+$/i.test(String(record.id||''))?record.id:newStoryId();
  if(ids[id])id=newStoryId();ids[id]=true;
  return{id:id,data:importedSingleDraft(record.data)};
 });
 var active=stories.find(function(story){return story.id===raw.activeStoryId;})||stories[0];
 var toggle=raw.publicationToggle===undefined?active.data.publicationToggle:(raw.publicationToggle===true||raw.publicationToggle==='true');
 stories.forEach(function(story){story.data.publicationToggle=toggle;story.data.mobileAnchorWidth=active.data.mobileAnchorWidth;});
 var collection={stories:stories,activeStoryId:active.id,cover:normalizeSharedCover(raw.cover,stories[0].data),contents:normalizeContents(raw.contents),reading:normalizeReading(raw.reading,active.data),common:normalizeCommonSettings(raw.common,active.data)};
 // Older drafts could retain the untouched default cover color after changing the background.
 if(!(Number(raw.backgroundSyncVersion)>=1)&&collection.cover.paperColor.toLowerCase()===defaults.paperColor.toLowerCase())collection.cover.paperColor=collection.common.paperColor;
 applyCommonSettings(collection);return collection;
}
function activeStory(){return storyCollection&&storyCollection.stories.find(function(story){return story.id===storyCollection.activeStoryId;});}
function runtimeForStory(story){return storyRuntime[story.id]||(storyRuntime[story.id]={hero:'',railImages:{},open:null});}
function captureActiveStory(){
 if(storyContextDepth||!storyCollection)return;
 var story=activeStory();draft.bodyHtml=editor.innerHTML;story.data=draft;applyCommonSettings(storyCollection);
 var runtime=runtimeForStory(story);runtime.hero=localHero;runtime.railImages=localRailImages;runtime.open=previewPublicationOpen;
}
function serializeStoryCollection(collection){
 var selected=collection.stories.find(function(story){return story.id===collection.activeStoryId;})||collection.stories[0];
 return Object.assign({},selected.data,{storiesVersion:4,backgroundSyncVersion:1,activeStoryId:selected.id,stories:collection.stories,cover:collection.cover,contents:collection.contents,reading:collection.reading,common:collection.common});
}
function storyDocument(){captureActiveStory();return serializeStoryCollection(storyCollection);}
function importedDraft(raw){
 if(raw&&Object.prototype.hasOwnProperty.call(raw,'stories'))return serializeStoryCollection(normalizeStoryCollection(raw));
 return importedSingleDraft(raw);
}
// Detached sources and scoped proof roots prevent exporting another story from
// pruning the active story's annotations, changing its selection, or saving it.
function withStoryContext(story,proof,callback){
 if(story===activeStory()&&!proof)return callback();
 var prior={draft:draft,editor:editor,hero:localHero,rail:localRailImages,open:previewPublicationOpen,proof:publicationProof,body:previewBody,selected:selectedAnnotationId};
 var runtime=runtimeForStory(story),source=document.createElement('div');
 source.innerHTML=story.data.bodyHtml;storyContextDepth++;
 draft=story.data;editor=source;localHero=runtime.hero;localRailImages=runtime.railImages;previewPublicationOpen=runtime.open;
 publicationProof=proof||null;previewBody=proof&&proof.querySelector('.prose');selectedAnnotationId='';
 try{return callback();}finally{
  story.data.bodyHtml=source.innerHTML;
  draft=prior.draft;editor=prior.editor;localHero=prior.hero;localRailImages=prior.rail;previewPublicationOpen=prior.open;
  publicationProof=prior.proof;previewBody=prior.body;selectedAnnotationId=prior.selected;storyContextDepth--;
 }
}

/* Arca keeps inline font-family but strips external font loading. Every choice therefore
   ends in an OS/generic fallback instead of depending on a copied web-font file. */
var titleFonts={
 playfair:{family:"Georgia,'Times New Roman',Times,serif",style:'italic'},
 italiana:{family:"Georgia,'Times New Roman',Times,serif",style:'normal'},
 dmserif:{family:"'Times New Roman',Times,Georgia,serif",style:'italic'},
 hahmlet:{family:"'AppleMyungjo',Batang,'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif",style:'normal'},
 pretendard:{family:"'Pretendard Variable','Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",style:'normal'},
 notosans:{family:"'Noto Sans KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",style:'normal'},
 notoserifkr:{family:"'Noto Serif KR','Nanum Myeongjo','AppleMyungjo',Batang,serif",style:'normal'},
 systemsans:{family:"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",style:'normal'},
 yugothic:{family:"'Yu Gothic','Hiragino Kaku Gothic ProN',Meiryo,'Noto Sans JP',sans-serif",style:'normal'},
 monodisplay:{family:"Consolas,Monaco,'Courier New',monospace",style:'normal'}
};
var bodyFonts={
 pretendard:"'Pretendard Variable','Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",
 notosans:"'Noto Sans KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",
 systemsans:"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Apple SD Gothic Neo','Malgun Gothic',Arial,sans-serif",
 systemgothic:"'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif",
 notoserif:"'Noto Serif KR','Nanum Myeongjo','AppleMyungjo',Batang,serif",
 nanummyeongjo:"'Nanum Myeongjo','Noto Serif KR','AppleMyungjo',Batang,serif",
 systemserif:"'AppleMyungjo',Batang,'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif",
 japanesans:"'Yu Gothic','Hiragino Sans','Hiragino Kaku Gothic ProN',Meiryo,'Noto Sans JP',sans-serif",
 japaneseserif:"'Yu Mincho','Hiragino Mincho ProN','MS Mincho','Noto Serif JP',serif",
 mono:"Consolas,Monaco,'Courier New',monospace"
};
var bodyFontLabels={pretendard:'Pretendard',notosans:'Noto Sans KR',systemsans:'System UI',systemgothic:'Apple SD Gothic Neo · Malgun Gothic',notoserif:'Noto Serif KR',nanummyeongjo:'Nanum Myeongjo',systemserif:'AppleMyungjo · Batang',japanesans:'Yu Gothic · Meiryo',japaneseserif:'Yu Mincho · MS Mincho',mono:'Consolas · Monaco'};
var titleFontAliases={bodoni:'playfair',cormorant:'playfair',instrument:'playfair',system:'playfair',gowunbatang:'hahmlet',songmyung:'hahmlet',shippori:'hahmlet',zenold:'hahmlet',kaisei:'hahmlet',yujisyuku:'hahmlet'};
var bodyFontAliases={kopubbatang:'notoserif',nanum:'nanummyeongjo',kopubdotum:'pretendard'};
function safeTitleFontKey(value){return titleFonts[value]?value:(titleFontAliases[value]||'playfair');}
function safeBodyFontKey(value){return bodyFonts[value]?value:(bodyFontAliases[value]||'notoserif');}
function titleFontSpec(value){return titleFonts[safeTitleFontKey(value)];}
function bodyFontFamily(value){return bodyFonts[safeBodyFontKey(value)];}
function titleAlignMode(value){return/^(left|center|right)$/.test(value)?value:'right';}
var PUBLICATION_WIDTH=960,PUBLICATION_TITLE_SIZE=118,PUBLICATION_BODY_GAP=44,RAIL_TOP_MAX=5000,RAIL_POSITION_MAX=5000;
function migrate(){try{var v2=JSON.parse(localStorage.getItem(OLD)||'null');if(!v2)return{};var h=String(v2.body||'').split(/\n\s*\n/).filter(Boolean).map(function(p){return'<p>'+escapeHtml(p)+'</p>';}).join('');return Object.assign({},v2,{bodyHtml:h||defaults.bodyHtml});}catch(e){return{};}}
function railItemId(){return'rail-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);}
function railSectionId(){return'rail-section-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);}
function annotationId(){return'ann-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);}
function normalizeAnnotation(raw){var item=raw&&typeof raw==='object'?raw:{},id=/^ann-[a-z0-9_-]+$/i.test(String(item.id||''))?String(item.id):annotationId(),hasInitial=item.initialY!==null&&item.initialY!==undefined&&item.initialY!=='',initial=hasInitial?Number(item.initialY):NaN,offset=Number(item.offsetY),height=Number(item.measuredHeight),color=/^#[0-9a-f]{6}$/i.test(String(item.color||''))?String(item.color).toUpperCase():String(defaults.metaColor).toUpperCase();return{id:id,text:String(item.text||''),font:item.font==='body'?'body':safeBodyFontKey(item.font),size:clampNumber(item.size,7,24,10),color:color,bold:item.bold===true||item.bold==='true',italic:item.italic===true||item.italic==='true',initialY:Number.isFinite(initial)?clampNumber(initial,0,RAIL_POSITION_MAX,0):null,offsetY:Number.isFinite(offset)?clampNumber(offset,-RAIL_POSITION_MAX,RAIL_POSITION_MAX,0):0,sectionId:String(item.sectionId||''),measuredHeight:Number.isFinite(height)?clampNumber(height,0,RAIL_POSITION_MAX,0):0,flowOffset:Number.isFinite(Number(item.flowOffset))?clampNumber(Number(item.flowOffset),-RAIL_POSITION_MAX,RAIL_POSITION_MAX,0):null,mobileInitialY:Number.isFinite(Number(item.mobileInitialY))?clampNumber(Number(item.mobileInitialY),0,RAIL_POSITION_MAX,0):null,mobileOffsetY:Number.isFinite(Number(item.mobileOffsetY))?clampNumber(Number(item.mobileOffsetY),-RAIL_POSITION_MAX,RAIL_POSITION_MAX,0):0,mobileFlowOffset:Number.isFinite(Number(item.mobileFlowOffset))?clampNumber(Number(item.mobileFlowOffset),-RAIL_POSITION_MAX,RAIL_POSITION_MAX,0):null,mobileMeasuredHeight:Number.isFinite(Number(item.mobileMeasuredHeight))?clampNumber(Number(item.mobileMeasuredHeight),0,RAIL_POSITION_MAX,0):0};}
function normalizeAnnotations(items){var ids={};return(Array.isArray(items)?items:[]).map(normalizeAnnotation).filter(function(item){if(ids[item.id])return false;ids[item.id]=true;return true;});}
function bodyParagraphCountHtml(html){var box=document.createElement('div');box.innerHTML=String(html||'');return Math.max(1,Array.prototype.slice.call(box.children).filter(paragraphBlockElement).length);}
function normalizeRailItem(raw){
 var item=raw&&typeof raw==='object'?raw:{},type=/^(image|divider)$/.test(item.type)?item.type:'text',align=/^(left|center|right)$/.test(item.align)?item.align:'left',hasPosition=item.positionY!==null&&item.positionY!==undefined&&item.positionY!=='',positionY=hasPosition?Number(item.positionY):NaN,measuredHeight=Number(item.measuredHeight),legacyGap=item.gapAfter===undefined?item.marginBottom:item.gapAfter,base={id:String(item.id||railItemId()),type:type,marginTop:clampNumber(item.marginTop,0,RAIL_TOP_MAX,0),marginBottom:clampNumber(item.marginBottom,0,RAIL_TOP_MAX,16),gapAfter:clampNumber(legacyGap,0,RAIL_TOP_MAX,16),mobileGapAfter:Number.isFinite(Number(item.mobileGapAfter))?clampNumber(Number(item.mobileGapAfter),0,RAIL_TOP_MAX,16):null,positionY:Number.isFinite(positionY)?clampNumber(positionY,0,RAIL_POSITION_MAX,0):null,measuredHeight:Number.isFinite(measuredHeight)?clampNumber(measuredHeight,0,RAIL_POSITION_MAX,0):0,align:align};
 if(type==='image'){base.url=String(item.url||'');base.width=clampNumber(item.width,25,100,100);if(!/^(left|center|right)$/.test(item.align))base.align='center';}
 else if(type==='divider'){base.width=clampNumber(item.width,10,100,100);base.thickness=clampNumber(item.thickness,1,8,1);if(!/^(left|center|right)$/.test(item.align))base.align='left';}
 else{base.text=String(item.text||'');base.font=item.font==='body'?'body':safeBodyFontKey(item.font);base.size=clampNumber(item.size,7,36,12);base.bold=item.bold===true||item.bold==='true';base.italic=item.italic===true||item.italic==='true';}
 return base;
}
function legacyRailItems(data){var items=[];if(String(data.railTopText||'').trim())items.push(normalizeRailItem({type:'text',text:data.railTopText,font:'body',size:13,bold:true,marginBottom:28}));if(String(data.railImageUrl||'').trim())items.push(normalizeRailItem({type:'image',url:data.railImageUrl,width:100,align:'center',marginBottom:22}));if(String(data.railBottomText||'').trim())items.push(normalizeRailItem({type:'text',text:data.railBottomText,font:'pretendard',size:8,marginBottom:12}));return items;}
function normalizeRailSection(raw,paragraphCount){var section=raw&&typeof raw==='object'?raw:{},count=Math.max(1,Number(paragraphCount)||1),start=clampNumber(section.startParagraph,1,count,1),end=clampNumber(section.endParagraph,1,count,count),side=/^(left|right)$/.test(section.side)?section.side:'left',items=Array.isArray(section.items)?section.items.map(normalizeRailItem):[];start=Math.round(start);end=Math.max(start,Math.round(end));return{id:String(section.id||railSectionId()),side:side,width:clampNumber(section.width,16,42,26),startParagraph:start,endParagraph:end,topOffset:clampNumber(section.topOffset,0,RAIL_TOP_MAX,0),mobileTopOffset:Number.isFinite(Number(section.mobileTopOffset))?clampNumber(Number(section.mobileTopOffset),0,RAIL_TOP_MAX,0):null,items:items};}
function uniqueRailSections(sections){var sectionIds={},itemIds={};sections.forEach(function(section){if(sectionIds[section.id])section.id=railSectionId();sectionIds[section.id]=true;section.items.forEach(function(item){if(itemIds[item.id])item.id=railItemId();itemIds[item.id]=true;});});return sections;}
function legacyRailSectionFlow(items){items=items.map(normalizeRailItem);if(!railItemsUseCoordinates(items))return{topOffset:0,items:items};items.sort(function(a,b){return railItemPosition(a)-railItemPosition(b);});var topOffset=railItemPosition(items[0])||0;items.forEach(function(item,index){if(index===items.length-1)return;var next=items[index+1],height=clampNumber(item.measuredHeight,0,RAIL_POSITION_MAX,0),distance=railItemPosition(next)-railItemPosition(item);item.gapAfter=height>0?Math.max(0,distance-height):clampNumber(item.gapAfter,0,RAIL_TOP_MAX,16);});return{topOffset:topOffset,items:items};}
function migrateRailSections(raw,data){var count=bodyParagraphCountHtml(data.bodyHtml),sections,hasVersion=Number(raw&&raw.railSectionsVersion)>=1,hasNewSections=raw&&Array.isArray(raw.railSections)&&raw.railSections.length>0;if(hasVersion||hasNewSections)sections=(Array.isArray(raw.railSections)?raw.railSections:[]).map(function(section){return normalizeRailSection(section,count);});else{var items=Array.isArray(data.railItems)?data.railItems.map(normalizeRailItem):legacyRailItems(data),layout=/^(rail-left|rail-right)$/.test(data.bodyLayout)?data.bodyLayout:'full',flow=legacyRailSectionFlow(items);sections=layout==='full'?[]:[normalizeRailSection({side:layout==='rail-right'?'right':'left',width:data.railWidth,startParagraph:1,endParagraph:count,topOffset:flow.topOffset,items:flow.items},count)];}return uniqueRailSections(sections);}
function migrateHeaderColors(raw,data){var map={kickerColor:'metaColor',issueColor:'metaColor',quoteColor:'dialogueColor',authorColor:'metaColor',footerColor:'metaColor'};Object.keys(map).forEach(function(field){if(!raw||raw[field]===undefined)data[field]=data[map[field]];});return data;}
var publicationPromptFonts={
 arial:{family:'Arial,sans-serif',style:'normal'},
 georgia:{family:"Georgia,'Times New Roman',Times,serif",style:'normal'},
 georgiaitalic:titleFonts.playfair,
 times:{family:"'Times New Roman',Times,Georgia,serif",style:'normal'},
 timesitalic:titleFonts.dmserif
};
function safePublicationPromptFont(value){return value==='body'||Object.prototype.hasOwnProperty.call(publicationPromptFonts,value)||Object.prototype.hasOwnProperty.call(bodyFonts,value)?value:'arial';}
function publicationPromptFontSpec(value){var key=safePublicationPromptFont(value);if(key==='body')return{family:bodyFontFamily(draft.bodyFont),style:'normal'};return publicationPromptFonts[key]||{family:bodyFontFamily(key),style:'normal'};}
function publicationPromptAlign(value){return/^(left|center|right)$/.test(value)?value:'center';}
function normalizePublicationToggle(data){
 data.publicationToggle=data.publicationToggle===true;
 data.publicationInitialState=data.publicationInitialState==='open'?'open':'closed';
 data.singleStoryView=data.singleStoryView==='cover'?'cover':'contents';
 data.showStoryNumbers=data.showStoryNumbers!==false;
 data.storyTitleFont=safePublicationPromptFont(data.storyTitleFont===undefined?'body':data.storyTitleFont);
 data.publicationReadPrompt=data.publicationReadPrompt===true;
 data.publicationReadPromptText=publicationPromptText(data.publicationReadPromptText);
 data.publicationReadPromptFont=safePublicationPromptFont(data.publicationReadPromptFont);
 data.publicationReadPromptAlign=publicationPromptAlign(data.publicationReadPromptAlign);
 data.publicationReadPromptHeight=Math.round(clampNumber(data.publicationReadPromptHeight,64,240,96));
 return data;
}
function publicationPromptText(value){return Array.from(String(value===undefined||value===null?defaults.publicationReadPromptText:value).replace(/\s+/g,' ')).slice(0,32).join('');}
function publicationPromptHeight(){return draft.publicationToggle&&draft.publicationReadPrompt?(hasStoryContents()?32:Math.round(clampNumber(draft.publicationReadPromptHeight,64,240,96))):0;}
function publicationPromptHtml(forPreview,height){
 if(!height)return'';
 var copy=escapeHtml(publicationPromptText(draft.publicationReadPromptText))||'&nbsp;',font=publicationPromptFontSpec(draft.publicationReadPromptFont),align=publicationPromptAlign(draft.publicationReadPromptAlign),surface='background-color:'+draft.paperColor+';background-image:linear-gradient('+draft.paperColor+','+draft.paperColor+');';
 if(hasStoryContents())return '<span'+(forPreview?' data-publication-read-prompt="true" data-story-read-prompt="true"':'')+' style="display:table;width:100%;height:'+height+'px;'+surface+'"><span style="display:table-cell;padding:8px 4.167% 0;vertical-align:top;text-align:'+align+';font-family:'+font.family+';font-size:9px;line-height:12px;font-weight:400;font-style:'+font.style+';letter-spacing:.12em;white-space:normal;overflow-wrap:anywhere;color:'+draft.metaColor+';">'+copy+'</span></span>';
 return'<span'+(forPreview?' data-publication-read-prompt="true"':'')+' style="display:table;width:100%;height:'+height+'px;'+surface+'"><span style="display:table-cell;padding:12px 4.167%;vertical-align:middle;text-align:'+align+';font-family:'+font.family+';font-size:11px;line-height:20px;font-weight:400;font-style:'+font.style+';letter-spacing:.2em;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;color:'+draft.metaColor+';">'+copy+'</span></span>';
}
function publicationIsOpen(forPreview){return forPreview&&typeof previewPublicationOpen==='boolean'?previewPublicationOpen:draft.publicationInitialState==='open';}
function publicationDisclosure(){return publicationProof?publicationProof.querySelector('details[id$="publicationDisclosure"]'):document.getElementById('publicationDisclosure');}
function refreshPublicationToggleSettings(){
 document.getElementById('publicationToggleOptions').hidden=!draft.publicationToggle;
 document.getElementById('publicationReadingSettings').hidden=!draft.publicationToggle;
 document.getElementById('publicationReadPromptOptions').hidden=!draft.publicationReadPrompt;
 document.getElementById('singleStoryPromptHeight').hidden=hasStoryContents();
 document.getElementById('singleStoryViewSettings').hidden=hasStoryContents();
 document.getElementById('showSingleStoryHeading').checked=storyCollection.reading.singleStoryView!=='cover';
 document.getElementById('contentsSettings').hidden=isSingleCoverView();
 document.getElementById('publicationReadPromptLabel').textContent='읽기 안내';
 document.getElementById('publicationReadPromptHelp').textContent=hasStoryContents()?'여러 이야기에서는 접힌 각 이야기 제목 바로 아래에 작은 안내를 표시합니다.':isSingleCoverView()?'표지나 안내를 누르면 본문이 열립니다. 목차와 이야기 제목은 표시하지 않습니다.':'단일 이야기에서는 접힌 제목 아래에 안내와 여백을 표시합니다.';
 var select=document.querySelector('[data-field="publicationReadPromptFont"]'),font=publicationPromptFontSpec(draft.publicationReadPromptFont);
 if(document.activeElement!==select)select.value=safePublicationPromptFont(draft.publicationReadPromptFont);
 select.style.fontFamily=font.family;select.style.fontStyle=font.style;
 Array.prototype.forEach.call(select.options,function(option){var spec=publicationPromptFontSpec(option.value);option.style.fontFamily=spec.family;option.style.fontStyle=spec.style;});
}
function openPublicationPreview(){var disclosure=publicationDisclosure();if(disclosure){previewPublicationOpen=true;disclosure.open=true;scheduleRailMeasurementSync();scheduleAnnotationLayout();}}
// Measure the full layout synchronously, including when the reader preview is folded.
// Restoring `open` before the next paint keeps the cover still and preserves note positions.
function withExpandedPublication(measure){var disclosure=publicationDisclosure(),closed=disclosure&&!disclosure.open;if(closed)disclosure.open=true;try{return measure();}finally{if(closed)disclosure.open=false;}}
function load(){
 try{
  var stored=JSON.parse(localStorage.getItem(KEY)||'{}');
  if(Object.prototype.hasOwnProperty.call(stored,'stories')){storyCollection=normalizeStoryCollection(stored);return activeStory().data;}
  var saved=stored,data=Object.assign({},defaults,migrate(),saved),oldSample=!saved.sampleVersion&&(saved.title==='Cammoristi'||/시뇨리아 광장|카모라가 거뒀다/.test(String(saved.bodyHtml||'')));
  if(saved.showLogMeta===undefined&&saved.showInfo!==undefined)data.showLogMeta=!!saved.showInfo;
  if(saved.showComment===undefined&&saved.showInfo!==undefined)data.showComment=!!saved.showInfo;
  if(saved.indentEnabled===undefined)data.indentEnabled=Number(saved.textIndent)>0;
  if(!/^(none|normal|top|bottom|left|right|vignette)$/.test(data.overlayMode))data.overlayMode='normal';
  data.titleFont=safeTitleFontKey(data.titleFont);
  data.titleAlign=titleAlignMode(data.titleAlign);
  data.bodyFont=safeBodyFontKey(data.bodyFont);
  normalizePublicationToggle(data);
  migrateHeaderColors(saved,data);
  data.railItems=Array.isArray(saved.railItems)?saved.railItems.map(normalizeRailItem):legacyRailItems(data);
  data.railSections=migrateRailSections(saved,data);
  data.annotations=normalizeAnnotations(saved.annotations);
  data.storyTitle=String(saved.storyTitle===undefined?data.title||'':saved.storyTitle);
  data.storyTitleAlign=contentsAlign(data.storyTitleAlign);
  if(oldSample){['kicker','issue','title','quote','author','bodyHtml','footer','sampleVersion'].forEach(function(k){data[k]=defaults[k];});data.annotations=[];}
  return data;
 }catch(e){var fallback=Object.assign({},defaults);fallback.railItems=[];fallback.railSections=[];fallback.annotations=[];return fallback;}
}
function escapeHtml(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function text(id,v){var e=document.getElementById(id);if(e)e.textContent=v||'';}
var draft=load(),editor=document.getElementById('bodyEditor'),fields=document.querySelectorAll('[data-field]'),localHero='',localRailImages={},savedRange=null;
if(!storyCollection){var initialStory={id:newStoryId(),data:draft};storyCollection={stories:[initialStory],activeStoryId:initialStory.id,cover:normalizeSharedCover(null,draft),contents:normalizeContents(null),reading:normalizeReading(null,draft),common:normalizeCommonSettings(null,draft)};}
editor.innerHTML=draft.bodyHtml||defaults.bodyHtml;
function save(){if(storyContextDepth)return;draft.bodyHtml=editor.innerHTML;try{localStorage.setItem(KEY,JSON.stringify(storyDocument()));text('saveState','저장됨 · '+new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}));}catch(e){text('saveState','브라우저 저장 용량 초과 · HTML 복사 또는 백업 권장');}}
function clampNumber(value,min,max,fallback){var n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;}
function paragraphAlignmentLines(el){
 if(!el||!el.childNodes)return[];
 var nodes=Array.prototype.filter.call(el.childNodes,function(node){return node.nodeType===3?!!node.textContent.trim():!(node.nodeType===1&&node.hasAttribute('data-annotation-inline-note'));});
 return nodes.length&&nodes.every(function(node){return node.nodeType===1&&node.tagName==='DIV'&&/^(center|justify)$/.test(node.style.textAlign);})?nodes:[];
}
function centeredBodyBlock(el){
 if(!el||!el.style)return false;
 var lines=paragraphAlignmentLines(el);
 return lines.length?lines.every(function(line){return line.style.textAlign==='center';}):el.style.textAlign==='center';
}
function normalizeParagraphAlignment(root){
 root.querySelectorAll('p,blockquote,h2,h3,h4,h5,h6,li').forEach(function(block){
  var lines=paragraphAlignmentLines(block);if(!lines.length)return;
  var align=lines[0].style.textAlign;if(!lines.every(function(line){return line.style.textAlign===align;}))return;
  // Chrome wraps soft lines during native alignment. Flatten only the saved clone,
  // keeping the live DOM intact so its native undo history remains usable.
  block.style.textAlign=align;
  lines.forEach(function(line,index){
   if(index)block.insertBefore(document.createElement('br'),line);
   if(line.childNodes.length===1&&line.firstChild.nodeName==='BR')line.firstChild.remove();
   while(line.firstChild)block.insertBefore(line.firstChild,line);
   line.remove();
  });
 });
}
function activeIndent(){return clampNumber(draft.textIndent,0,80,0);}
function resolvedLayout(fig){var layout=fig.dataset.layout;return/^(left|right|center|full)$/.test(layout)?layout:'left';}
function imageHeight(fig){return Math.round(clampNumber(fig.dataset.height,0,2400,0));}
function imageSizeCss(fig){var height=imageHeight(fig),view=imageView(fig);return'display:block;width:100%;height:'+(height?height+'px':'auto')+';'+(height?'object-fit:cover;object-position:'+view.focusX+'% '+view.focusY+'%;':'');}
function imageView(fig){return{zoom:clampNumber(fig.dataset.zoom,100,300,100),focusX:clampNumber(fig.dataset.focusX,0,100,50),focusY:clampNumber(fig.dataset.focusY,0,100,50)};}
function imageLineOffset(fig){return clampNumber(fig.dataset.lineOffset,0,100,0);}
function imageLinePixels(){return clampNumber(draft.bodySize,10,28,14)*clampNumber(draft.lineHeight,1,3,2);}
function imageBaseMargin(layout){return layout==='left'||layout==='right'?8:28;}
function imageFlowTopMargin(fig){var layout=resolvedLayout(fig),prefix=fig.previousElementSibling;return imageBaseMargin(layout)-((layout==='center'||layout==='full')&&prefix&&prefix.dataset.imageFlowContinues==='true'?Math.min(imageBaseMargin(layout),Number(draft.paragraphGap)||0):0);}
// Extend full images through the outer paper gutter, preserving the sidebar edge.
function applyFullImageBleed(fig,section){
 if(resolvedLayout(fig)!=='full')return;
 var outer=4.167,proseShare=section?(100-clampNumber(section.width,16,42,26)-4)/100:1,
     gutter=outer/(1-2*outer/100)/proseShare,
     left=section&&section.side==='left'?0:gutter,right=section&&section.side==='right'?0:gutter;
 function percent(value){return Math.round(value*1000000)/1000000+'%';}
 fig.style.setProperty('width',percent(100+left+right),'important');fig.style.maxWidth='none';
 fig.style.marginLeft=percent(-left);fig.style.marginRight=percent(-right);
}
function applyImageLineOffset(fig){var layout=resolvedLayout(fig),shift=imageLineOffset(fig)*imageLinePixels(),floating=layout==='left'||layout==='right';fig.style.paddingTop=floating&&shift>0?shift+'px':'0px';fig.style.shapeOutside=floating&&shift>0?'inset('+shift+'px 0 0 0)':'none';fig.style.marginTop=(imageFlowTopMargin(fig)+(floating?Math.min(0,shift):shift))+'px';fig.style.setProperty('--image-line-shift',floating&&shift>0?shift+'px':'0px');}
function ensureImageViewport(fig){var img=fig.querySelector('img'),viewport=fig.querySelector('.body-image-viewport');if(!img)return null;if(!viewport){viewport=document.createElement('div');viewport.className='body-image-viewport';img.parentNode.insertBefore(viewport,img);viewport.appendChild(img);}return viewport;}
function applyImageView(fig,forOutput){var viewport=ensureImageViewport(fig),img=fig.querySelector('img'),view=imageView(fig);if(!viewport||!img)return;viewport.style.cssText=forOutput?'overflow:hidden;width:100%;line-height:0;':'';img.style.cssText=imageSizeCss(fig)+'transform:scale('+(view.zoom/100)+');transform-origin:'+view.focusX+'% '+view.focusY+'%;';}
function captionSetting(fig,side,key,fallback){var prop='caption'+side+key,value=fig.dataset[prop];if(value===undefined||value===''){var legacy='caption'+key.charAt(0).toUpperCase()+key.slice(1);value=fig.dataset[legacy];}return value===undefined||value===''?fallback:value;}
function captionFontFamily(fig,side){var key=captionSetting(fig,side,'Font','body');if(key==='body')key=draft.bodyFont;return bodyFontFamily(key);}
function applyCaptionStyle(fig,forOutput){fig.querySelectorAll('figcaption').forEach(function(c){var top=c.classList.contains('caption-top'),side=top?'Top':'Bottom',family=captionFontFamily(fig,side),bold=captionSetting(fig,side,'Bold','false')==='true',italic=captionSetting(fig,side,'Italic','false')==='true',size=clampNumber(captionSetting(fig,side,'Size',10),7,24,10),base=(top?'margin:0 0 8px;':'margin:8px 0 0;')+'font-family:'+family+';font-size:'+size+'px;line-height:1.6;color:#6b665e;text-align:center;letter-spacing:.08em;font-weight:'+(bold?'700':'400')+';font-style:'+(italic?'italic':'normal')+';';if(forOutput)c.style.cssText=base;else{c.style.fontFamily=family;c.style.fontSize=size+'px';c.style.fontWeight=bold?'700':'400';c.style.fontStyle=italic?'italic':'normal';}});}
function cleanBody(forOutput){var box=document.createElement('div');box.innerHTML=editor.innerHTML;var centered=Array.prototype.filter.call(box.querySelectorAll('p,blockquote,h2,h3,h4,h5,h6,li'),centeredBodyBlock);box.querySelectorAll('.image-block-controls').forEach(function(x){x.remove();});box.querySelectorAll('.editor-image-block').forEach(function(fig){var layout=resolvedLayout(fig),width=Number(fig.dataset.width)||45,next=fig.nextElementSibling,img=fig.querySelector('img'),exportUrl=normalizeImageSource(fig.dataset.exportUrl||'');fig.className='body-image layout-'+layout;fig.dataset.layout=layout;fig.removeAttribute('contenteditable');fig.style.cssText='width:'+(layout==='full'?100:width)+'%;';if(forOutput&&img&&exportUrl)img.setAttribute('src',exportUrl);applyImageView(fig,forOutput);applyImageLineOffset(fig);fig.querySelectorAll('figcaption').forEach(function(cap){cap.removeAttribute('contenteditable');});});if(forOutput){var font=bodyFontFamily(draft.bodyFont);box.querySelectorAll('p').forEach(function(p){p.style.cssText='margin:0 0 '+(p.dataset.imageFlowContinues==='true'?0:draft.paragraphGap)+'px;font-family:'+font+';font-size:'+draft.bodySize+'px;line-height:'+draft.lineHeight+';letter-spacing:'+draft.letterSpacing+'px;text-indent:'+activeIndent()+'px;color:'+draft.textColor+';text-align:justify;word-break:keep-all;';});box.querySelectorAll('blockquote').forEach(function(q){q.style.cssText='margin:20px 0 '+(q.dataset.imageFlowContinues==='true'?0:20)+'px;color:'+draft.dialogueColor+';font-weight:'+(draft.dialogueBold?'700':'400')+';line-height:'+draft.lineHeight+';';});box.querySelectorAll('h2,h3,h4,h5,h6').forEach(function(h){var level=Number(h.tagName.slice(1)),scale=level===2?1.5:level===3?1.3:1.15;h.style.cssText='clear:both;margin:30px 0 16px;font-size:'+scale+'em;color:'+draft.textColor+';';});box.querySelectorAll('hr').forEach(function(h){h.style.cssText='clear:both;width:38%;margin:32px auto;border:0;border-top:1px solid #8d887f;';});box.querySelectorAll('.body-image').forEach(function(fig){var l=(fig.className.match(/layout-(\w+)/)||[])[1],w=fig.style.width,shift=imageLineOffset(fig)*imageLinePixels(),floating=l==='left'||l==='right',top=imageFlowTopMargin(fig)+(floating?Math.min(0,shift):shift),css='width:'+w+';';if(l==='left')css+='float:left;clear:none;margin:'+top+'px 28px 18px 0;';else if(l==='right')css+='float:right;clear:none;margin:'+top+'px 0 18px 28px;';else css+='clear:both;margin:'+top+'px auto 28px;';if(floating&&shift>0)css+='box-sizing:border-box;padding-top:'+shift+'px;shape-outside:inset('+shift+'px 0 0 0);';fig.style.cssText=css;applyImageView(fig,true);applyCaptionStyle(fig,true);var blank=fig.querySelector('.body-image-blank');if(blank)blank.style.cssText='box-sizing:border-box;width:100%;height:0;padding-bottom:150%;background:transparent;';});}centered.forEach(function(el){el.style.textAlign='center';el.style.textIndent='0';});return box.innerHTML;}
function textLineCount(value){return Math.max(1,String(value||'').split(/\r?\n/).length);}
function visualTextUnits(value){return Array.from(String(value||'')).reduce(function(total,char){if(/\s/.test(char))return total+.34;if(/[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\u3040-\u30ff\uff00-\uffef]/.test(char))return total+1;return total+.55;},0);}
function estimatedWrappedLines(value,capacity){return String(value||'').split(/\r?\n/).reduce(function(total,line){return total+Math.max(1,Math.ceil(visualTextUnits(line)/capacity));},0);}
function mobileHeroMinimum(){var metaLines=estimatedWrappedLines(draft.kicker,11.5)+estimatedWrappedLines(draft.issue,11.5),quoteLines=estimatedWrappedLines(draft.quote,10.2),titleLines=estimatedWrappedLines(draft.title,5.8),authorLines=estimatedWrappedLines(draft.author,20),metaHeight=Math.max(metaLines*16.2,quoteLines*23.4+2),height=44+metaHeight+52+titleLines*42.24+14+authorLines*20.8+36;return Math.max(320,Math.ceil(height));}
function getHeroMetrics(){var titleLines=textLineCount(draft.title),authorLines=textLineCount(draft.author),metaLines=textLineCount(draft.kicker)+textLineCount(draft.issue),quoteLines=textLineCount(draft.quote),titleLine=PUBLICATION_TITLE_SIZE*.88,authorLine=20.8,metaHeight=Math.max(metaLines*16.2,quoteLines*23.4+2),base=clampNumber(draft.heroHeight,140,720,360),manualShift=Math.max(0,base-360),extra=Math.max(0,titleLines-1)*titleLine+Math.max(0,authorLines-1)*authorLine,contentMinimum=44+metaHeight+78+manualShift+titleLines*titleLine+14+authorLines*authorLine+24;return{manualShift:manualShift,extra:Math.ceil(extra),minimum:Math.ceil(contentMinimum),effective:Math.ceil(Math.max(base+extra,contentMinimum))};}
function multilineHtml(value){return escapeHtml(value).replace(/\r\n?|\n/g,'<br>');}
function multilineBlocks(value){return String(value||'').split(/\r?\n/).map(function(line){return'<div>'+(line?escapeHtml(line):'&nbsp;')+'</div>';}).join('');}
function bodyLayoutMode(){return/^(rail-left|rail-right)$/.test(draft.bodyLayout)?draft.bodyLayout:'full';}
function activeRailSections(){return(Array.isArray(draft.railSections)?draft.railSections:[]).map(function(section){return normalizeRailSection(section,bodyParagraphCountHtml(draft.bodyHtml));});}
function hasRailSections(){return activeRailSections().length>0;}
function railTextFont(item){var key=item.font==='body'?draft.bodyFont:item.font;return bodyFontFamily(key);}
function railImageSource(item,forOutput,allowLocal,preferRemote){var remote=normalizeImageSource(item.url||'');if(forOutput)return/^https:\/\//i.test(remote)?remote:'';if(preferRemote&&remote)return remote;return allowLocal&&localRailImages[item.id]?localRailImages[item.id]:remote;}
function railItemPosition(item){if(!item||item.positionY===null||item.positionY===undefined||item.positionY==='')return null;var n=Number(item.positionY);return Number.isFinite(n)?clampNumber(n,0,RAIL_POSITION_MAX,0):null;}
function railItemsUseCoordinates(items){return!!items.length&&items.every(function(item){return railItemPosition(item)!==null;});}
function railVisualHtml(item,forOutput,allowLocal,preferRemote){
 var align=/^(left|center|right)$/.test(item.align)?item.align:'left',previewAttrs=forOutput?'':' class="rail-preview-item rail-preview-text" data-rail-id="'+escapeHtml(item.id)+'"';
 if(item.type==='text'){
  if(!String(item.text||'').trim())return'';
  return'<div'+previewAttrs+' style="font-family:'+railTextFont(item)+';font-size:'+clampNumber(item.size,7,36,12)+'px;line-height:1.65;font-weight:'+(item.bold?'700':'400')+';font-style:'+(item.italic?'italic':'normal')+';text-align:'+align+';color:'+draft.textColor+';">'+multilineHtml(item.text)+'</div>';
 }
 if(item.type==='divider'){
  var dividerWidth=clampNumber(item.width,10,100,100),dividerMargin=align==='left'?'0 auto 0 0':align==='right'?'0 0 0 auto':'0 auto';
  previewAttrs=forOutput?'':' class="rail-preview-item rail-preview-divider" data-rail-id="'+escapeHtml(item.id)+'"';
  return'<div'+previewAttrs+' style="width:100%;font-size:0;line-height:0;"><div style="width:'+dividerWidth+'%;height:'+clampNumber(item.thickness,1,8,1)+'px;margin:'+dividerMargin+';background-color:'+draft.metaColor+';font-size:0;line-height:0;">&nbsp;</div></div>';
 }
 var src=railImageSource(item,forOutput,allowLocal,preferRemote);if(!src)return'';
 var width=clampNumber(item.width,25,100,100),margin=align==='left'?'0 auto 0 0':align==='right'?'0 0 0 auto':'0 auto';
 previewAttrs=forOutput?'':' class="rail-preview-item rail-preview-image-wrap" data-rail-id="'+escapeHtml(item.id)+'"';
 return'<div'+previewAttrs+' style="font-size:0;line-height:0;text-align:'+align+';"><img src="'+escapeHtml(src)+'" alt="" referrerpolicy="no-referrer" style="display:block;width:'+width+'%;height:auto;margin:'+margin+';border:0;"></div>';
}
function railTopOffset(section){var v=mobileViewOn&&section&&section.mobileTopOffset!==null&&section.mobileTopOffset!==undefined?section.mobileTopOffset:section&&section.topOffset;return clampNumber(v,0,RAIL_TOP_MAX,0);}
function setRailTopOffset(section,value){if(!section)return;if(mobileViewOn)section.mobileTopOffset=clampNumber(value,0,RAIL_TOP_MAX,0);else section.topOffset=clampNumber(value,0,RAIL_TOP_MAX,0);}
function railGapAfter(item){var v=mobileViewOn&&item&&item.mobileGapAfter!==null&&item.mobileGapAfter!==undefined?item.mobileGapAfter:item&&item.gapAfter;return clampNumber(v,0,RAIL_TOP_MAX,16);}
function setRailGapAfter(item,value){if(!item)return;if(mobileViewOn)item.mobileGapAfter=clampNumber(value,0,RAIL_TOP_MAX,16);else item.gapAfter=clampNumber(value,0,RAIL_TOP_MAX,16);}
function railContentHtml(forOutput,allowLocal,preferRemote,section){
 var items=(section&&Array.isArray(section.items)?section.items:(Array.isArray(draft.railItems)?draft.railItems:[])).map(normalizeRailItem),sectionMode=!!section,positioned=!sectionMode&&railItemsUseCoordinates(items),entries=[];
 if(positioned)items.sort(function(a,b){return railItemPosition(a)-railItemPosition(b);});
 items.forEach(function(item){var html=railVisualHtml(item,forOutput,allowLocal,preferRemote);if(!html&&sectionMode){var attrs=forOutput?'':' class="rail-preview-item rail-preview-placeholder" data-rail-id="'+escapeHtml(item.id)+'"';html='<div'+attrs+' style="min-height:1px;font-size:0;line-height:0;">&nbsp;</div>';}if(html)entries.push({item:item,html:html});});
 if(!entries.length)return'&nbsp;';
 if(!positioned)return entries.map(function(entry,index){var item=entry.item,last=index===entries.length-1,
  topPc=sectionMode?(index===0?clampNumber(section.topOffset,0,RAIL_TOP_MAX,0):0):clampNumber(item.marginTop,0,RAIL_TOP_MAX,0),
  topMobile=sectionMode&&index===0?section.mobileTopOffset:null,
  bottomPc=sectionMode?(last?0:clampNumber(item.gapAfter,0,RAIL_TOP_MAX,16)):clampNumber(item.marginBottom,0,RAIL_TOP_MAX,16),
  bottomMobile=sectionMode&&!last?item.mobileGapAfter:null,
  topCss=forOutput?responsiveLength(topPc,topMobile):(sectionMode?(index===0?railTopOffset(section):0):topPc)+'px',
  bottomCss=forOutput?responsiveLength(bottomPc,bottomMobile):(sectionMode?(last?0:railGapAfter(item)):bottomPc)+'px';
  return'<div style="padding:'+topCss+' 0 '+bottomCss+';">'+entry.html+'</div>';}).join('');
 if(!forOutput){
  var canvasHeight=entries.reduce(function(max,entry){var item=entry.item,height=Math.max(1,clampNumber(item.measuredHeight,0,RAIL_POSITION_MAX,1));return Math.max(max,railItemPosition(item)+height+clampNumber(item.marginBottom,0,RAIL_TOP_MAX,0));},1);
  return'<div class="rail-preview-canvas" style="position:relative;width:100%;min-height:'+Math.round(canvasHeight)+'px;">'+entries.map(function(entry){return'<div class="rail-preview-slot" data-rail-slot-id="'+escapeHtml(entry.item.id)+'" style="position:absolute;top:'+Math.round(railItemPosition(entry.item))+'px;left:0;right:0;">'+entry.html+'</div>';}).join('')+'</div>';
 }
 var cursor=0;
 return entries.map(function(entry){var item=entry.item,y=Math.round(railItemPosition(item)),height=Math.max(1,clampNumber(item.measuredHeight,0,RAIL_POSITION_MAX,1)),delta=y-cursor,spacer=delta>0?'<div style="height:'+delta+'px;font-size:0;line-height:0;">&nbsp;</div>':'',shift=delta<0?'margin-top:'+delta+'px;':'';cursor=y+height;return spacer+'<div style="display:block;width:100%;height:'+height+'px;'+shift+'">'+entry.html+'</div>';}).join('');
}
function paragraphBlockElement(el){if(el&&el.dataset.imageCaret==='true'&&blankParagraph(el))return false;if(!el||!/^(P|BLOCKQUOTE|H2|H3|H4|H5|H6)$/.test(el.tagName)||el.dataset.imageContinuation==='true')return false;var value=String(el.textContent||'').replace(/\u00a0/g,' ').trim();return!!value&&!(el.tagName==='P'&&/^(---|\*\*\*|___)$/.test(value));}
function orderedRailSections(paragraphCount){return activeRailSections().map(function(section){section.startParagraph=clampNumber(section.startParagraph,1,paragraphCount,1);section.endParagraph=clampNumber(section.endParagraph,section.startParagraph,paragraphCount,paragraphCount);return section;});}
function railSectionForParagraph(sections,index){for(var i=0;i<sections.length;i++)if(index>=sections[i].startParagraph&&index<=sections[i].endParagraph)return sections[i];return null;}
function ensureEditorBlock(){if(!editor)return false;if(editor.querySelector('p,blockquote,h2,h3,h4,h5,h6,hr,figure,ul,ol'))return false;if(String(editor.textContent||'').replace(/​/g,'').trim())return false;editor.innerHTML='<p><br></p>';return true;}
function marginColumnMetrics(section){var railWidth=clampNumber(section.width,16,42,26),prose=Math.max(20,100-railWidth-4);
 return{width:Math.round(railWidth/prose*10000)/100,shift:Math.round((railWidth+4)/prose*10000)/100,right:section.side==='right'};}
var MOBILE_PC_ANCHOR=1000,ARCA_COLUMN_RATIO=.936;
function marginFloatStyle(section,gap,top,noClear){var m=marginColumnMetrics(section),
 topCss=typeof top==='string'?top:Math.round(clampNumber(top,-RAIL_POSITION_MAX,RAIL_POSITION_MAX,0))+'px',
 sideCss=m.right?'margin-right:-'+m.shift+'%;margin-left:0;':'margin-left:-'+m.shift+'%;margin-right:0;';
 return'box-sizing:border-box;display:block;float:'+(m.right?'right':'left')+';'+(noClear?'':'clear:'+(m.right?'right':'left')+';')+'width:'+m.width+'%;margin-top:'+topCss+';margin-bottom:'+gap+'px;'+sideCss;}
function responsiveLength(pcValue,mobileValue){var pc=Math.round(Number(pcValue)||0);
 if(mobileValue===null||mobileValue===undefined||Math.round(Number(mobileValue))===pc)return pc+'px';
 var mobile=Math.round(Number(mobileValue)),anchor=clampNumber(draft.mobileAnchorWidth,280,560,375),wide=Math.max(anchor+200,MOBILE_PC_ANCHOR),
     slope=Math.round((pc-mobile)/(wide-anchor)*100000)/100000,low=Math.min(mobile,pc),high=Math.max(mobile,pc);
 return'clamp('+low+'px,calc('+mobile+'px + (100vw - '+anchor+'px) * '+slope+'),'+high+'px)';}
function annotationExportTop(item){
 var pc=item.flowOffset===null||item.flowOffset===undefined?item.offsetY:item.flowOffset;
 var css=responsiveLength(pc,item.mobileFlowOffset);
 return css.indexOf('clamp')===0?css:Math.round(pc);}
function bodySegmentMarkup(forPreview){
 var source=cleanBody(true,!!forPreview,true),box=document.createElement('div');box.innerHTML=source;
 var children=Array.prototype.slice.call(box.children),paragraphCount=Math.max(1,children.filter(paragraphBlockElement).length),sections=orderedRailSections(paragraphCount);
 if(!sections.length){box.querySelectorAll('figure.body-image').forEach(function(fig){applyFullImageBleed(fig,null);});return forPreview?box.innerHTML:makeArcaBodySafe(box,false).innerHTML;}
 var paragraph=0,groups=[];
 children.forEach(function(el){var isParagraph=paragraphBlockElement(el),previous=el.previousElementSibling,belongsToPrevious=el.dataset.imageContinuation==='true'||el.dataset.imageFlowContinues==='true'||(el.classList.contains('body-image')&&previous&&previous.dataset.imageFlowContinues==='true');if(isParagraph)paragraph++;var paragraphIndex=isParagraph||belongsToPrevious?Math.max(1,paragraph):(paragraph<paragraphCount?paragraph+1:Math.max(1,paragraph)),section=railSectionForParagraph(sections,paragraphIndex),key=section?section.id:'full',last=groups[groups.length-1];if(!last||last.key!==key){last={key:key,section:section,nodes:[]};groups.push(last);}last.nodes.push(el);});
 var renderedSections={},markup=groups.map(function(group,index){group.nodes.forEach(function(el){if(el.matches('figure.body-image'))applyFullImageBleed(el,group.section);});var content=group.nodes.map(function(el){return el.outerHTML;}).join(''),previewSegment=forPreview?' class="publication-body-segment" data-body-segment="'+escapeHtml(group.key)+'"':'',proseAttrs=forPreview?' class="publication-body-segment-prose" data-body-segment-prose="true"':'',clear=index?'<div'+(forPreview?' data-body-segment-clear="true"':'')+' style="clear:both;height:0;font-size:0;line-height:0;">&nbsp;</div>':'';
   if(!group.section)return clear+'<div'+previewSegment+'><div'+proseAttrs+'>'+content+'</div></div>';
   var section=group.section,railWidth=clampNumber(section.width,16,42,26),firstSectionOccurrence=!renderedSections[section.id],railHtml=firstSectionOccurrence?railContentHtml(!forPreview,!!forPreview,false,section):'&nbsp;',railAttrs=forPreview?' class="publication-rail-cell" data-rail-container="true" data-rail-section-id="'+escapeHtml(section.id)+'" contenteditable="false"':'',proseCellAttrs=forPreview?' class="publication-segment-prose-cell"':'',railFloat=!forPreview&&firstSectionOccurrence&&railHtml!=='&nbsp;'?'<div style="'+marginFloatStyle(section,14)+'">'+railHtml+'</div>':'',railCell='<td'+railAttrs+' style="width:'+railWidth+'%;padding:0;vertical-align:top;border:0;">'+(railFloat?'&nbsp;':railHtml)+'</td>',gapCell='<td style="width:4%;padding:0;border:0;">&nbsp;</td>',proseCell='<td'+proseCellAttrs+' style="padding:0;vertical-align:top;border:0;"><div'+proseAttrs+'>'+railFloat+content+'</div></td>',cells=section.side==='right'?proseCell+gapCell+railCell:railCell+gapCell+proseCell;renderedSections[section.id]=true;
  return clear+'<div'+previewSegment+'><table border="0" cellpadding="0" cellspacing="0" style="width:100%;border:0;border-collapse:collapse;table-layout:fixed;"><tbody><tr style="border:0;">'+cells+'</tr></tbody></table></div>';
 }).join('');
 var output=document.createElement('div');output.innerHTML=markup;if(!forPreview)makeArcaBodySafe(output,false);return output.innerHTML;
}
var heroAspectProbeSrc='';
function measureHeroAspect(src){
 if(!src||src===heroAspectProbeSrc)return;
 var ownerDraft=draft;
 heroAspectProbeSrc=src;
 var probe=new Image();
 probe.onload=function(){if(!probe.naturalWidth||!probe.naturalHeight)return;var aspect=clampNumber(Math.round(probe.naturalHeight/probe.naturalWidth*10000)/100,20,180,56.25);if(Math.abs(clampNumber(ownerDraft.heroAspect,20,180,56.25)-aspect)>.05){ownerDraft.heroAspect=aspect;if(draft===ownerDraft)render();}};
 probe.onerror=function(){if(draft===ownerDraft)heroAspectProbeSrc='';};
 probe.referrerPolicy='no-referrer';
 probe.src=src;
}
function heroBackgroundData(src,forHtml){
 var layers=[],sizes=[],positions=[],blends=[],fade=draft.gradientMode==='fade',zoom=clampNumber(draft.heroZoom,100,300,100),focusX=clampNumber(draft.heroFocusX,0,100,50),focusY=clampNumber(draft.heroFocusY,0,100,50),overlay=draft.overlayMode||'none',opacity=clampNumber(draft.heroOpacity,0,100,40),safe=String(src||'').replace(/'/g,'%27').replace(/"/g,'%22');
 if(forHtml)safe=escapeHtml(safe);
 if(!safe)return{image:'none',size:'auto',position:'center',repeat:'no-repeat',blend:'normal'};
 if(fade){layers.push('linear-gradient(to bottom,rgba(0,0,0,0) '+draft.fadeStart+'%,'+hexRgba(draft.paperColor,clampNumber(draft.fadeStrength,0,100,100)/100)+' '+draft.fadeEnd+'%)');sizes.push('100% 100%');positions.push('center');blends.push('normal');}
 var overlayCss=overlayGradientCss(overlay,draft.overlayColor,draft.overlayOpacity);if(overlayCss){layers.push(overlayCss);sizes.push('100% 100%');positions.push('center');blends.push('normal');}
 if(opacity<100){layers.push('linear-gradient('+hexRgba(draft.paperColor,1-opacity/100)+','+hexRgba(draft.paperColor,1-opacity/100)+')');sizes.push('100% 100%');positions.push('center');blends.push('normal');}
 layers.push('url(\''+safe+'\')');sizes.push(zoom+'% auto');positions.push(focusX+'% '+focusY+'%');blends.push('normal');
 return{image:layers.join(','),size:sizes.join(','),position:positions.join(','),repeat:'no-repeat',blend:blends.join(',')};
}
function render(){
 refreshPublicationToggleSettings();
 ensureEditorBlock();
 text('pvKicker',draft.kicker);text('pvIssue',draft.issue);text('pvQuote',draft.quote);text('pvTitle',draft.title);text('pvAuthor',draft.author);text('pvFooter',draft.footer);
 var paper=document.getElementById('paper'),title=document.getElementById('pvTitle'),ts=titleFontSpec(draft.titleFont),body=document.getElementById('pvBody'),bodyFamily=bodyFontFamily(draft.bodyFont),hero=document.getElementById('heroArtwork'),heroImage=document.getElementById('heroArtworkImage'),heroTint=document.getElementById('heroArtworkTint'),heroFade=document.getElementById('heroArtworkFade'),paperBody=document.getElementById('paperBody'),sideRail=document.getElementById('sideRail'),bodyLayout=bodyLayoutMode(),railWidth=clampNumber(draft.railWidth,16,42,26),titleAlign=titleAlignMode(draft.titleAlign),authorMargin=titleAlign==='right'?'14px 2.5% 0 0':'14px 0 0';
 paper.style.background=draft.paperColor;paper.style.color=draft.textColor;paper.style.setProperty('--title-align',titleAlign);paper.style.setProperty('--title-author-margin',authorMargin);title.style.fontFamily=ts.family;title.style.fontStyle=ts.style;title.style.fontWeight='700';title.style.color=draft.titleColor;document.getElementById('pvKicker').style.color=draft.kickerColor;document.getElementById('pvIssue').style.color=draft.issueColor;var previewQuote=document.getElementById('pvQuote');previewQuote.style.fontFamily=bodyFamily;previewQuote.style.fontWeight=draft.dialogueBold?'700':'400';previewQuote.style.color=draft.quoteColor;var previewAuthor=document.getElementById('pvAuthor');previewAuthor.style.fontFamily=bodyFamily;previewAuthor.style.color=draft.authorColor;document.getElementById('pvFooter').style.color=draft.footerColor;
 paperBody.className='paper-body '+(bodyLayout==='full'?'full':bodyLayout==='rail-left'?'side-left':'side-right');paperBody.style.backgroundColor=draft.paperColor;paperBody.style.gridTemplateColumns=bodyLayout==='rail-left'?railWidth+'% minmax(0,1fr)':bodyLayout==='rail-right'?'minmax(0,1fr) '+railWidth+'%':'';sideRail.hidden=bodyLayout==='full';sideRail.innerHTML=bodyLayout==='full'?'':railContentHtml(false,true,false);
 body.innerHTML=cleanBody(false);body.style.fontFamily=bodyFamily;body.style.fontSize=draft.bodySize+'px';body.style.lineHeight=draft.lineHeight;body.style.letterSpacing=draft.letterSpacing+'px';body.style.color=draft.textColor;body.querySelectorAll('p').forEach(function(p){p.style.marginBottom=draft.paragraphGap+'px';p.style.textIndent=(centeredBodyBlock(p)?0:activeIndent())+'px';});
 var src=sharedCoverLocalImage||normalizeImageSource(draft.heroImageUrl),heroMetrics=getHeroMetrics(),heroCss=heroBackgroundData(src,false);hero.style.display='block';hero.style.height=heroMetrics.effective+'px';hero.style.opacity='1';hero.style.backgroundColor=draft.paperColor;hero.style.backgroundImage=heroCss.image;hero.style.backgroundSize=heroCss.size;hero.style.backgroundPosition=heroCss.position;hero.style.backgroundRepeat=heroCss.repeat;hero.style.backgroundBlendMode=heroCss.blend;heroImage.style.display='none';heroTint.style.display='none';heroFade.style.display='none';paper.style.setProperty('--hero-title-shift',heroMetrics.manualShift+'px');
 requestAnimationFrame(function(){var baseMargin=74+(PUBLICATION_BODY_GAP-28);paperBody.style.marginTop=baseMargin+'px';if(!src)return;var minimumTop=heroMetrics.effective+PUBLICATION_BODY_GAP,currentTop=paperBody.offsetTop;if(currentTop<minimumTop)paperBody.style.marginTop=(baseMargin+minimumTop-currentTop)+'px';});
 ['Date','Model','Prompt','Bot','Persona','Comment'].forEach(function(k){text('pvLog'+k,draft['log'+k]);});var meta=document.getElementById('pvMetaBlock'),comment=document.getElementById('pvCommentBlock'),metaAny=false;document.querySelectorAll('[data-info-item]').forEach(function(item){var has=!!String(draft[item.dataset.infoItem]||'').trim();item.hidden=!has;if(has)metaAny=true;});meta.hidden=!draft.showLogMeta||!metaAny;comment.hidden=!draft.showComment;var infoVisible=!(meta.hidden&&comment.hidden);document.getElementById('pvInfo').hidden=!infoVisible;document.getElementById('pvFooter').style.borderBottom='1px solid #8f8980';
 var proofOutput=makeHtml(true),copyOutput=makeHtml(false),proof=document.getElementById('publicationProof');document.getElementById('htmlOutput').value=copyOutput;if(proof)proof.innerHTML=proofOutput;scheduleRailMeasurementSync();save();refreshRailAnnotationRows();
}
function hexRgba(hex,a){var h=String(hex).replace('#',''),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return'rgba('+r+','+g+','+b+','+a+')';}
function overlayGradientCss(mode,color,opacity){var a=clampNumber(opacity,0,100,20)/100,ink=hexRgba(color,a),clear=hexRgba(color,0);if(mode==='none'||a<=0)return'';if(mode==='top')return'linear-gradient(to bottom,'+ink+','+clear+')';if(mode==='bottom')return'linear-gradient(to top,'+ink+','+clear+')';if(mode==='left')return'linear-gradient(to right,'+ink+','+clear+')';if(mode==='right')return'linear-gradient(to left,'+ink+','+clear+')';if(mode==='vignette')return'radial-gradient(circle at center,'+clear+' 35%,'+ink+' 100%)';return'linear-gradient('+ink+','+ink+')';}
function infoHtml(){var items=[['DATE',draft.logDate],['MODEL',draft.logModel],['PROMPT',draft.logPrompt],['BOT',draft.logBot],['PERSONA',draft.logPersona]].filter(function(item){return String(item[1]||'').trim();}),comment=String(draft.logComment||''),meta='',family=bodyFontFamily(draft.bodyFont),labelStyle='display:inline-block;margin-right:5px;font-family:'+family+';font-size:inherit;line-height:inherit;font-style:normal;font-weight:700;text-shadow:.35px 0 currentColor,-.35px 0 currentColor;',valueStyle='font-family:'+family+';font-size:inherit;font-style:normal;font-weight:400;';if(draft.showLogMeta&&items.length){meta='<div style="padding:0;font-family:'+family+';">'+items.map(function(item){return'<span style="display:inline-block;margin:0 22px 8px 0;vertical-align:top;font-family:'+family+';"><span style="'+labelStyle+'">'+item[0]+'</span><span style="'+valueStyle+'">'+multilineHtml(item[1])+'</span></span>';}).join('')+'</div>';}var note=draft.showComment?'<div style="clear:both;margin-top:14px;padding:0;font-family:'+family+';"><span style="'+labelStyle+'">COMMENT</span><div style="margin-top:4px;white-space:pre-wrap;font-family:'+family+';font-size:inherit;font-style:normal;font-weight:400;">'+multilineHtml(comment)+'</div></div>':'';return meta||note?'<div style="clear:both;margin-top:42px;font-family:'+family+';font-size:12px;line-height:1.8;">'+meta+note+'</div>':'';}
function previewNarrowWidth(forPreview){return forPreview&&mobileViewOn?mobileAnchorWidth():0;}
function lengthVw(value,narrow){return narrow?Math.round(value*narrow/100)+'px':value+'vw';}
function makeHtml(forPreview,part){
 var narrowPreview=previewNarrowWidth(forPreview),
     ts=titleFontSpec(draft.titleFont),
     bodyFamily=bodyFontFamily(draft.bodyFont),
     src=normalizeImageSource(draft.heroImageUrl);
 if(forPreview&&sharedCoverLocalImage)src=sharedCoverLocalImage;
 if(!forPreview&&!/^https:\/\//i.test(src))src='';
 var titleWeight='700',titleStyle=ts.style,heroMetrics=getHeroMetrics(),segmentedBody=bodySegmentMarkup(!!forPreview),bodyFlow=forPreview?'<div id="publicationEditBody" class="prose">'+segmentedBody+'</div>':segmentedBody,titleAlign=titleAlignMode(draft.titleAlign),authorMargin=titleAlign==='right'?'14px 2.5% 0 0':'14px 0 0',information=isLastStoryData(draft)?infoHtml():'',titleMargin=78+heroMetrics.manualShift,titleMarginVw=Math.round(titleMargin/PUBLICATION_WIDTH*100000)/1000;
   var headerTopContent='<table border="0" cellpadding="0" cellspacing="0" style="width:100%;border:0;border-collapse:collapse;table-layout:fixed;"><tbody><tr style="border:0;"><td style="width:47%;padding:0;border:0;vertical-align:top;font-family:Arial,sans-serif;font-size:9px;line-height:1.8;letter-spacing:.12em;white-space:normal;word-break:normal;overflow-wrap:anywhere;"><div style="color:'+draft.kickerColor+';">'+multilineHtml(draft.kicker)+'</div><div style="color:'+draft.issueColor+';">'+multilineHtml(draft.issue)+'</div></td><td style="width:53%;padding:2px 0 0 4%;border:0;vertical-align:top;text-align:right;color:'+draft.quoteColor+';font-family:'+bodyFamily+';font-size:13px;line-height:1.8;font-weight:'+(draft.dialogueBold?'700':'400')+';white-space:normal;word-break:keep-all;overflow-wrap:anywhere;">'+multilineHtml(draft.quote)+'</td></tr></tbody></table>',
   titleContent='<div style="width:100%;margin:52px 0 0;margin-top:clamp(52px,'+lengthVw(titleMarginVw,narrowPreview)+','+titleMargin+'px);text-align:'+titleAlign+';font-family:'+ts.family+';font-size:48px;font-size:clamp(48px,'+lengthVw(12,narrowPreview)+','+PUBLICATION_TITLE_SIZE+'px);line-height:.88;font-style:'+titleStyle+';font-weight:'+titleWeight+';letter-spacing:-.07em;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;color:'+draft.titleColor+';">'+multilineHtml(draft.title)+'</div>'+ 
   '<div style="margin:'+authorMargin+';text-align:'+titleAlign+';font-family:'+bodyFamily+';font-size:13px;line-height:1.6;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;color:'+draft.authorColor+';">'+multilineHtml(draft.author)+'</div>',headerContent=headerTopContent+titleContent,heroHtml;
    if(src){
      var mobileMin=mobileHeroMinimum(),h=Math.max(heroMetrics.effective,mobileMin),overlayLayers=[],paperTint=1-clampNumber(draft.heroOpacity,0,100,40)/100,paperVeil=paperTint>0?hexRgba(draft.paperColor,paperTint):'',focusX=clampNumber(draft.heroFocusX,0,100,50),focusY=clampNumber(draft.heroFocusY,0,100,50);
   if(draft.gradientMode==='fade')overlayLayers.push('linear-gradient(to bottom,rgba(0,0,0,0) '+clampNumber(draft.fadeStart,0,100,45)+'%,'+hexRgba(draft.paperColor,clampNumber(draft.fadeStrength,0,100,100)/100)+' '+clampNumber(draft.fadeEnd,0,100,100)+'%)');
   var overlayCss=overlayGradientCss(draft.overlayMode,draft.overlayColor,draft.overlayOpacity);if(overlayCss)overlayLayers.push(overlayCss);
      var heroVw=Math.round(h/PUBLICATION_WIDTH*100000)/1000,gradientCss=(paperVeil?'background-color:'+paperVeil+';':'')+(overlayLayers.length?'background-image:'+overlayLayers.join(',')+';':''),
          heroBandCss='height:clamp('+mobileMin+'px,'+lengthVw(heroVw,narrowPreview)+','+h+'px);',
          coverSrc=escapeHtml(String(src).replace(/'/g,'%27').replace(/"/g,'%22')),
          heroZoom=clampNumber(draft.heroZoom,100,300,100),
          imageWideRatio=Math.round(10000/clampNumber(draft.heroAspect,20,180,56.25))/100,
          coverSize=heroZoom===100?'cover':'calc(max(100%,'+imageWideRatio+' * clamp('+mobileMin+'px,'+lengthVw(heroVw,narrowPreview)+','+h+'px)) * '+heroZoom/100+') auto';
      heroHtml='<div style="box-sizing:border-box;display:table;width:100%;margin:0;padding:0;background-color:'+draft.paperColor+';background-image:url(&#39;'+coverSrc+'&#39;);background-size:'+coverSize+';background-position:'+focusX+'% '+focusY+'%;background-repeat:no-repeat;">'+
       '<div style="box-sizing:border-box;display:table-cell;width:100%;'+heroBandCss+'margin:0;padding:44px 4.167% 24px;vertical-align:top;text-align:left;white-space:normal;font-size:13px;line-height:normal;'+gradientCss+'">'+headerContent+'</div></div>';
  }else heroHtml='<div style="box-sizing:border-box;min-height:'+heroMetrics.effective+'px;padding:44px 4.167% 24px;background-color:'+draft.paperColor+';">'+headerContent+'</div>';
 if(part==='cover')return forPreview?heroHtml:makeArcaFragmentSafeHtml(heroHtml,false);
 if(part==='story')heroHtml=isSingleCoverView()?(forPreview?'<div data-single-story-cover="true">'+sharedCoverHtml(true)+'</div>':sharedCoverHtml(false)):storyHeadingHtml(forPreview);
 // The open body paints over the fixed-height summary prompt using only inline styles.
 // Keep its full-width surface separate from the existing inset body and annotation layout.
 var promptHeight=publicationPromptHeight(),promptHtml=publicationPromptHtml(forPreview,promptHeight),
     promptCoverStart=promptHeight?'<div'+(forPreview?' data-publication-prompt-cover="true"':'')+' style="display:inline-block;vertical-align:top;width:100%;min-height:'+promptHeight+'px;margin-top:-'+promptHeight+'px;background-color:'+draft.paperColor+';background-image:linear-gradient('+draft.paperColor+','+draft.paperColor+');">':'',
     promptCoverEnd=promptHeight?'</div>':'';
 var disclosureStart=draft.publicationToggle?'<details'+(forPreview?' id="publicationDisclosure"':'')+(publicationIsOpen(forPreview)?' open':'')+' style="display:block;margin:0;padding:0;border:0;'+(promptHeight?'font-size:0;line-height:0;':'')+'"><summary'+(forPreview?' class="publication-toggle-summary"':'')+' title="'+(isSingleCoverView()?'표지를':'제목을')+' 눌러 본문 접기·펼치기" aria-label="'+escapeHtml(isSingleCoverView()?storyCollection.cover.title:storyTitle({data:draft}))+' 본문 접기 및 펼치기" style="display:block;list-style:none;margin:0;padding:0;border:0;">':'',disclosureHeroEnd=draft.publicationToggle?promptHtml+'</summary>'+promptCoverStart:'';
 var result='<div style="width:'+PUBLICATION_WIDTH+'px;max-width:100%;'+(draft.publicationToggle||part==='story'?'':'min-height:720px;')+'margin:0 auto;background-color:'+draft.paperColor+';border:0;color:'+draft.textColor+';font-family:'+bodyFamily+';">'+disclosureStart+heroHtml+disclosureHeroEnd+
 '<div style="clear:both;overflow-wrap:anywhere;margin:0 4.167%;padding:'+PUBLICATION_BODY_GAP+'px 0 46px;background-color:'+draft.paperColor+';font-family:'+bodyFamily+';font-size:'+draft.bodySize+'px;line-height:'+draft.lineHeight+';letter-spacing:'+draft.letterSpacing+'px;color:'+draft.textColor+';">'+bodyFlow+'<div style="clear:both;margin-top:22px;padding-bottom:12px;border-bottom:1px solid #8f8980;color:'+draft.footerColor+';font-family:Arial,sans-serif;font-size:10px;line-height:1.6;letter-spacing:.2em;">'+multilineHtml(draft.footer)+'</div>'+information+(usesCollectionCredit()?'':'<div style="margin-top:18px;text-align:right;font-family:Arial,sans-serif;font-size:10px;line-height:1.2;letter-spacing:2px;color:'+draft.metaColor+';">LETTER LOG</div>')+'</div>'+promptCoverEnd+(draft.publicationToggle?'</details>':'')+'</div>';
 return forPreview?result:makeArcaFragmentSafeHtml(result,false);
}
function imageBlock(url,captionTop,captionBottom,layout,width,zoom,focusX,focusY,captionFont,captionBold,captionItalic,lineOffset,exportUrl,topFont,topBold,topItalic,topSize,bottomFont,bottomBold,bottomItalic,bottomSize,lineIndex,blank,height){
 layout=/^(left|right|center|full)$/.test(layout)?layout:'left';
 var isBlank=blank===true||blank==='true',visual=isBlank?'<div class="body-image-blank" aria-label="빈 이미지 자리"></div>':'<img src="'+escapeHtml(url)+'" alt="" referrerpolicy="no-referrer" loading="eager">';
 topFont=topFont||captionFont||'body';bottomFont=bottomFont||captionFont||'body';
 topBold=topBold===true||topBold==='true'||captionBold===true||captionBold==='true';bottomBold=bottomBold===true||bottomBold==='true'||captionBold===true||captionBold==='true';
 topItalic=topItalic===true||topItalic==='true'||captionItalic===true||captionItalic==='true';bottomItalic=bottomItalic===true||bottomItalic==='true'||captionItalic===true||captionItalic==='true';
 return'<figure class="editor-image-block" data-blank="'+isBlank+'" data-height="'+Math.round(clampNumber(height,0,2400,0))+'" data-layout="'+layout+'" data-width="'+(width||32)+'" data-zoom="'+(zoom||100)+'" data-focus-x="'+(focusX===undefined?50:focusX)+'" data-focus-y="'+(focusY===undefined?50:focusY)+'" data-caption-top-font="'+escapeHtml(topFont)+'" data-caption-top-bold="'+topBold+'" data-caption-top-italic="'+topItalic+'" data-caption-top-size="'+clampNumber(topSize,7,24,10)+'" data-caption-bottom-font="'+escapeHtml(bottomFont)+'" data-caption-bottom-bold="'+bottomBold+'" data-caption-bottom-italic="'+bottomItalic+'" data-caption-bottom-size="'+clampNumber(bottomSize,7,24,10)+'" data-line-offset="'+clampNumber(lineOffset,0,100,0)+'" data-line-index="'+clampNumber(lineIndex,-1000,1000,Number(lineOffset)||0)+'" data-export-url="'+escapeHtml(exportUrl||'')+'" contenteditable="false"><div class="image-block-controls"><select data-image-layout><option value="left">왼쪽</option><option value="right">오른쪽</option><option value="center">중앙</option><option value="full">전체</option></select><input data-image-width type="range" min="20" max="100" value="'+(width||32)+'"><button type="button" data-image-delete>삭제</button></div><figcaption class="caption-top" contenteditable="true">'+escapeHtml(captionTop)+'</figcaption><div class="body-image-viewport">'+visual+'</div><figcaption class="caption-bottom" contenteditable="true">'+escapeHtml(captionBottom)+'</figcaption></figure><p><br></p>';
}
function insertAtRange(html){editor.focus();var sel=window.getSelection();if(savedRange){sel.removeAllRanges();sel.addRange(savedRange);}document.execCommand('insertHTML',false,html);savedRange=null;render();}
var cleanBodyBase=cleanBody;cleanBody=function(forOutput){var box=document.createElement('div');box.innerHTML=cleanBodyBase(forOutput);box.querySelectorAll('blockquote.thought').forEach(function(q){q.style.color=draft.thoughtColor;q.style.fontStyle=draft.thoughtItalic?'italic':'normal';q.style.border='0';q.style.padding='0';if(!centeredBodyBlock(q))q.style.textAlign='inherit';});box.querySelectorAll('strong,em').forEach(function(x){x.style.color=draft.emphasisColor;});return box.innerHTML;};
var renderBase=render;render=function(){renderBase();var prose=document.getElementById('pvBody');prose.style.setProperty('--emphasis-color',draft.emphasisColor);prose.style.setProperty('--dialogue-color',draft.dialogueColor);prose.style.setProperty('--thought-color',draft.thoughtColor);document.getElementById('pvKicker').style.color=draft.kickerColor;document.getElementById('pvIssue').style.color=draft.issueColor;document.getElementById('pvQuote').style.color=draft.quoteColor;document.getElementById('pvAuthor').style.color=draft.authorColor;document.getElementById('pvFooter').style.color=draft.footerColor;document.querySelectorAll('[data-color-text]').forEach(function(o){if(document.activeElement!==o)o.value=String(settingOwner(o.dataset.colorText)[o.dataset.colorText]||'').toUpperCase();});syncRangeControls();};
var colorRenderTimer=null;
function applyColorPreview(field,value){var paper=document.getElementById('paper'),prose=document.getElementById('pvBody'),headerTargets={kickerColor:'pvKicker',issueColor:'pvIssue',quoteColor:'pvQuote',authorColor:'pvAuthor',footerColor:'pvFooter'};if(field==='paperColor'){paper.style.background=value;storyCollection.cover.paperColor=value;}if(field==='textColor'){paper.style.color=value;prose.style.color=value;}if(field==='titleColor')document.getElementById('pvTitle').style.color=value;if(field==='dialogueColor'){prose.style.setProperty('--dialogue-color',value);prose.querySelectorAll('.auto-dialogue').forEach(function(x){x.style.color=value;});}if(field==='thoughtColor'){prose.style.setProperty('--thought-color',value);prose.querySelectorAll('.auto-thought').forEach(function(x){x.style.color=value;});}if(field==='emphasisColor'){prose.style.setProperty('--emphasis-color',value);prose.querySelectorAll('strong,em').forEach(function(x){x.style.color=value;});}if(headerTargets[field])document.getElementById(headerTargets[field]).style.color=value;var code=document.querySelector('[data-color-text="'+field+'"]');if(code&&document.activeElement!==code)code.value=String(value).toUpperCase();}
function scheduleColorRender(){clearTimeout(colorRenderTimer);colorRenderTimer=setTimeout(function(){colorRenderTimer=null;render();},140);}
fields.forEach(function(el){var owner=settingOwner(el.dataset.field);if(el.type==='checkbox')el.checked=!!owner[el.dataset.field];else el.value=owner[el.dataset.field]===undefined?'':owner[el.dataset.field];el.addEventListener('input',function(){settingOwner(el.dataset.field)[el.dataset.field]=el.type==='checkbox'?el.checked:el.value;if(el.dataset.field==='publicationToggle'||el.dataset.field==='publicationInitialState')previewPublicationOpen=null;if(el.type==='color'){applyColorPreview(el.dataset.field,el.value);scheduleColorRender();}else{clearTimeout(colorRenderTimer);colorRenderTimer=null;render();}});});
document.querySelector('[data-field="publicationReadPromptHeight"]').addEventListener('change',function(){storyCollection.reading.publicationReadPromptHeight=Math.round(clampNumber(this.value,64,240,96));this.value=storyCollection.reading.publicationReadPromptHeight;render();});
editor.addEventListener('input',render);['keyup','mouseup','focus'].forEach(function(ev){editor.addEventListener(ev,function(){var s=window.getSelection();if(s.rangeCount&&editor.contains(s.anchorNode))savedRange=s.getRangeAt(0).cloneRange();});});document.querySelectorAll('[data-command]').forEach(function(b){b.onclick=function(){editor.focus();document.execCommand(b.dataset.command,false,null);render();};});document.querySelectorAll('[data-block]').forEach(function(b){b.onclick=function(){editor.focus();document.execCommand('formatBlock',false,b.dataset.block);render();};});document.getElementById('insertDividerBtn').onclick=function(){insertAtRange('<hr><p><br></p>');};document.getElementById('openImageInsertBtn').onclick=function(){var p=document.getElementById('imageInsertPanel');p.hidden=!p.hidden;};document.getElementById('insertImageBtn').onclick=function(){var u=document.getElementById('inlineImageUrl').value.trim();if(!/^https:\/\//i.test(u)){return;}insertAtRange(imageBlock(u,'',document.getElementById('inlineImageCaption').value,document.getElementById('inlineImageLayout').value,document.getElementById('inlineImageWidth').value));document.getElementById('imageInsertPanel').hidden=true;};editor.addEventListener('change',function(e){var f=e.target.closest('.editor-image-block');if(!f)return;if(e.target.matches('[data-image-layout]'))f.dataset.layout=e.target.value;if(e.target.matches('[data-image-width]'))f.dataset.width=e.target.value;render();});editor.addEventListener('input',function(e){var f=e.target.closest('.editor-image-block');if(f&&e.target.matches('[data-image-width]')){f.dataset.width=e.target.value;render();}});editor.addEventListener('click',function(e){if(e.target.matches('[data-image-delete]')){e.target.closest('.editor-image-block').remove();render();}});
document.querySelectorAll('.tab-button').forEach(function(b){b.onclick=function(){document.querySelectorAll('.tab-button,.tab-panel').forEach(function(x){x.classList.remove('active');});b.classList.add('active');document.querySelector('[data-panel="'+b.dataset.tab+'"]').classList.add('active');};});
function replacePairs(){return Array.prototype.slice.call(document.querySelectorAll('.replace-row')).map(function(row){return{from:row.querySelector('.replace-from').value,to:row.querySelector('.replace-to').value};}).filter(function(pair){return pair.from;});}
document.getElementById('replaceBtn').onclick=function(){var pairs=replacePairs();if(!pairs.length){text('replaceState','찾을 단어를 입력하세요.');return;}var walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT),nodes=[],n,count=0;while(n=walker.nextNode())if(!n.parentElement.closest('.image-block-controls'))nodes.push(n);pairs.forEach(function(pair){nodes.forEach(function(x){var c=x.data.split(pair.from).length-1;if(c){x.data=x.data.split(pair.from).join(pair.to);count+=c;}});});text('replaceState',count+'개를 치환했습니다.');render();};
document.getElementById('addReplaceRow').onclick=function(){var rows=document.getElementById('replaceRows'),index=rows.children.length+1,row=document.createElement('div');row.className='replace-row';row.innerHTML='<input class="replace-from" type="text" aria-label="찾을 단어 '+index+'" placeholder="찾을 단어"><span>→</span><input class="replace-to" type="text" aria-label="바꿀 단어 '+index+'" placeholder="바꿀 단어">';rows.appendChild(row);row.querySelector('.replace-from').focus();};
var heroImageReader=null,heroImageLoadId=0;
function setSharedCoverLocalImage(source){sharedCoverLocalImage=source;}
function cancelHeroImageLoad(){heroImageLoadId++;if(heroImageReader&&heroImageReader.readyState===1)heroImageReader.abort();heroImageReader=null;}
document.getElementById('heroImageFile').onchange=function(e){
 var file=e.target.files[0];cancelHeroImageLoad();if(!file)return;
 if(!/^image\//.test(file.type)){text('saveState','이미지 파일만 불러올 수 있습니다.');e.target.value='';return;}
 var reader=new FileReader(),owner=storyCollection,token=heroImageLoadId;heroImageReader=reader;
 reader.onload=function(){if(storyCollection!==owner||token!==heroImageLoadId)return;heroImageReader=null;setSharedCoverLocalImage(reader.result);sharedCoverProbe='';render();};
 reader.onerror=function(){if(token===heroImageLoadId){heroImageReader=null;text('saveState','이미지 파일을 읽지 못했습니다.');}};reader.readAsDataURL(file);
};
var heroUrlField=document.querySelector('[data-field="heroImageUrl"]');heroUrlField.addEventListener('input',function(){cancelHeroImageLoad();document.getElementById('heroImageFile').value='';if(String(this.value||'').trim()){setSharedCoverLocalImage('');sharedCoverProbe='';render();}});
document.getElementById('heroImageClear').onclick=function(){cancelHeroImageLoad();setSharedCoverLocalImage('');storyCollection.cover.heroImageUrl='';heroUrlField.value='';document.getElementById('heroImageFile').value='';sharedCoverProbe='';render();};
var railSectionsEditor=document.getElementById('railSectionsEditor'),draggedRailItemId='',draggedRailSectionId='',railImageLoads=new WeakMap();
function railSectionById(id){return(Array.isArray(draft.railSections)?draft.railSections:[]).find(function(section){return section.id===id;});}
function railItemRecord(id){var sections=Array.isArray(draft.railSections)?draft.railSections:[];for(var s=0;s<sections.length;s++){var index=sections[s].items.findIndex(function(item){return item.id===id;});if(index>=0)return{section:sections[s],sectionIndex:s,item:sections[s].items[index],itemIndex:index};}return null;}
function railItemById(id){var record=railItemRecord(id);return record&&record.item;}
function normalizeDraftRailSections(){var count=bodyParagraphCountHtml(editor.innerHTML);draft.railSections=uniqueRailSections((Array.isArray(draft.railSections)?draft.railSections:[]).map(function(section){var preservedCount=Math.max(count,Number(section.startParagraph)||1,Number(section.endParagraph)||1);return normalizeRailSection(section,preservedCount);}));return draft.railSections;}
function moveRailItem(section,from,to){if(!section||from<0||from>=section.items.length)return false;to=Math.max(0,Math.min(section.items.length-1,Math.round(to)));if(from===to)return false;var slotGaps=section.items.map(function(item){return item.gapAfter;}),moved=section.items.splice(from,1)[0];section.items.splice(to,0,moved);section.items.forEach(function(item,index){item.gapAfter=slotGaps[index]===undefined?16:slotGaps[index];});return true;}
function railFontOptions(selected){selected=selected==='body'?'body':safeBodyFontKey(selected);var labels=Object.assign({body:'본문 글꼴'},bodyFontLabels);return Object.keys(labels).map(function(key){var family=key==='body'?bodyFontFamily(draft.bodyFont):bodyFontFamily(key);return'<option value="'+key+'" style="font-family:'+family+';"'+(selected===key?' selected':'')+'>'+labels[key]+'</option>';}).join('');}
function railAlignOptions(selected){return['left','center','right'].map(function(key){var label=key==='left'?'왼쪽':key==='right'?'오른쪽':'가운데';return'<option value="'+key+'"'+(selected===key?' selected':'')+'>'+label+'</option>';}).join('');}
function setRailGapValue(record,side,value){var items=record.section.items,index=record.itemIndex,last=index===items.length-1,
 before=index>0?railGapAfter(items[index-1]):null,
 after=last?null:railGapAfter(items[index]),
 top=railTopOffset(record.section),delta;
 if(side==='before'){
  if(index===0){delta=value-top;setRailTopOffset(record.section,value);if(after!==null)setRailGapAfter(items[index],clampNumber(after-delta,0,RAIL_TOP_MAX,after));return;}
  delta=value-before;setRailGapAfter(items[index-1],value);
  if(after!==null)setRailGapAfter(items[index],clampNumber(after-delta,0,RAIL_TOP_MAX,after));
  return;}
 if(after===null)return;
 delta=value-after;setRailGapAfter(items[index],value);
 if(index>0)setRailGapAfter(items[index-1],clampNumber(before-delta,0,RAIL_TOP_MAX,before));
 else setRailTopOffset(record.section,clampNumber(top-delta,0,RAIL_TOP_MAX,top));}
function syncRailGapInputs(section,skip){if(!railSectionsEditor||!section)return;
 railSectionsEditor.querySelectorAll('.rail-section-card[data-rail-section-id="'+section.id+'"] [data-rail-gap]').forEach(function(input){
  if(input===skip)return;
  var card=input.closest('[data-rail-id]'),record=card&&railItemRecord(card.dataset.railId);
  if(!record)return;
  var value=input.dataset.railGap==='before'
   ?(record.itemIndex>0?railGapAfter(record.section.items[record.itemIndex-1]):railTopOffset(record.section))
   :railGapAfter(record.item);
  input.value=Math.round(value);});}
function railGapControls(section,item,index,total){var before=index===0?'<span class="rail-gap-none">없음</span>':'<input data-rail-gap="before" type="number" min="0" max="'+RAIL_TOP_MAX+'" value="'+railGapAfter(section.items[index-1])+'"><em>px</em>',after=index===total-1?'<span class="rail-gap-none">없음</span>':'<input data-rail-gap="after" type="number" min="0" max="'+RAIL_TOP_MAX+'" value="'+railGapAfter(item)+'"><em>px</em>';return'<div class="rail-neighbor-gaps"><label class="rail-gap-control"><span>윗블록과의 간격</span>'+before+'</label><label class="rail-gap-control"><span>아랫블록과의 간격</span>'+after+'</label></div>';}
function railItemEditorHtml(raw,index,total,section){
 var item=normalizeRailItem(raw),label=item.type==='text'?'문구':item.type==='image'?'이미지':'구분선',head='<header class="rail-item-head"><button class="rail-drag" type="button" draggable="true" aria-label="끌어서 순서 변경">⋮⋮</button><strong>'+label+' '+(index+1)+'</strong><span class="rail-item-actions"><button type="button" data-rail-action="up"'+(index===0?' disabled':'')+' aria-label="위로">↑</button><button type="button" data-rail-action="down"'+(index===total-1?' disabled':'')+' aria-label="아래로">↓</button><button type="button" data-rail-action="delete">삭제</button></span></header>',body='';
 if(item.type==='text'){var textFamily=railTextFont(item);body='<textarea data-rail-key="text" rows="3" placeholder="여백에 넣을 문구">'+escapeHtml(item.text)+'</textarea><div class="rail-format-row"><select data-rail-key="font" aria-label="문구 글꼴" style="font-family:'+textFamily+';">'+railFontOptions(item.font)+'</select><label><span>크기</span><input data-rail-key="size" type="number" min="7" max="36" value="'+item.size+'"><em>px</em></label><button type="button" data-rail-toggle="bold" class="'+(item.bold?'is-active':'')+'" aria-pressed="'+item.bold+'"><b>B</b></button><button type="button" data-rail-toggle="italic" class="'+(item.italic?'is-active':'')+'" aria-pressed="'+item.italic+'"><i>I</i></button></div><div class="rail-position-row"><label><span>정렬</span><select data-rail-key="align">'+railAlignOptions(item.align)+'</select></label></div>';}
 else if(item.type==='image'){var normalizedSource=normalizeImageSource(item.url),remote=/^https:\/\//i.test(normalizedSource),hasLocal=!!localRailImages[item.id],state=hasLocal?(remote?'로컬 미리보기 · 게시 주소 연결됨':'로컬 미리보기 · HTML 주소 필요'):(remote?'게시 주소 연결됨':normalizedSource?'HTML 주소 필요':'');body='<div class="rail-source-row"><input data-rail-key="url" type="url" value="'+escapeHtml(item.url)+'" placeholder="아카라이브용 HTTPS 주소"><label class="rail-file-button">파일 불러오기<input data-rail-file type="file" accept="image/*"></label></div><small class="rail-image-state">'+state+'</small><div class="rail-position-row rail-image-position"><label><span>폭</span><input data-rail-key="width" type="number" min="25" max="100" value="'+item.width+'"><em>%</em></label><label><span>정렬</span><select data-rail-key="align">'+railAlignOptions(item.align)+'</select></label></div>';}
 else body='<div class="rail-position-row rail-divider-controls"><label><span>길이</span><input data-rail-key="width" type="number" min="10" max="100" value="'+item.width+'"><em>%</em></label><label><span>굵기</span><input data-rail-key="thickness" type="number" min="1" max="8" value="'+item.thickness+'"><em>px</em></label><label><span>정렬</span><select data-rail-key="align">'+railAlignOptions(item.align)+'</select></label></div>';
 return'<article class="rail-item rail-'+item.type+'-item" data-rail-id="'+escapeHtml(item.id)+'" data-rail-section-id="'+escapeHtml(section.id)+'">'+head+body+railGapControls(section,item,index,total)+'</article>';
}
function railSectionOverlap(section){return draft.railSections.some(function(other){return other!==section&&section.startParagraph<=other.endParagraph&&section.endParagraph>=other.startParagraph;});}
var railAnnotationSignature='';
function annotationSectionEditorHtml(section){var entries=annotationRailEntries(section);
 if(!entries.length)return'<p class="rail-empty">이 구간에 달린 주석이 없습니다.</p>';
 return'<p class="rail-annotation-mode-line'+(mobileViewOn?' is-mobile':'')+'">'+(mobileViewOn?'모바일 위치 조정 중':'PC 위치')+'</p>'+entries.map(function(entry){var item=entry.item,copy=String(item.text||'').replace(/\s+/g,' ').trim(),placed=annotationInitial(item)!==null,moved=placed&&annotationOffset(item)!==0,hasMobile=item.mobileFlowOffset!==null&&item.mobileFlowOffset!==undefined;
  return'<div class="rail-annotation-row" data-annotation-row="'+escapeHtml(item.id)+'"><span class="rail-annotation-index">'+annotationNumber(entry.number)+'</span>'+(hasMobile?'<span class="rail-annotation-badge" title="모바일 위치가 따로 저장되어 있습니다">M</span>':'')+'<span class="rail-annotation-copy">'+escapeHtml(copy||'(내용 없음)')+'</span>'+'<span class="rail-item-actions"><button type="button" data-annotation-action="up"'+(placed?'':' disabled')+' aria-label="한 줄 위로" title="한 줄 위로">↑</button>'+'<button type="button" data-annotation-action="down"'+(placed?'':' disabled')+' aria-label="한 줄 아래로" title="한 줄 아래로">↓</button>'+'<button type="button" data-annotation-action="reset"'+(moved?'':' disabled')+' title="자동 위치로 되돌리기">초기</button></span></div>';}).join('');}
function refreshRailAnnotationRows(force){if(!railSectionsEditor)return;var sections=activeRailSections(),
 signature=(mobileViewOn?'M:':'P:')+sections.map(function(section){return section.id+':'+annotationRailEntries(section).map(function(entry){return entry.item.id+'#'+entry.number+'#'+(annotationInitial(entry.item)===null?'x':'o')+'#'+(annotationOffset(entry.item)?'m':'0')+'#'+(entry.item.mobileFlowOffset===null||entry.item.mobileFlowOffset===undefined?'-':'M')+'#'+String(entry.item.text||'').slice(0,60);}).join('|');}).join('||');
 if(!force&&signature===railAnnotationSignature)return;
 railAnnotationSignature=signature;
 sections.forEach(function(section){var host=railSectionsEditor.querySelector('.rail-section-card[data-rail-section-id="'+section.id+'"] [data-rail-annotation-list]');if(host)host.innerHTML=annotationSectionEditorHtml(section);});}
function railSectionEditorHtml(section,index,total,paragraphCount){var warning='<p class="rail-section-warning"'+(railSectionOverlap(section)?'':' hidden')+'>다른 구간과 겹칩니다 · 위에 있는 구간이 먼저 적용됩니다.</p>';return'<article class="rail-section-card" data-rail-section-id="'+escapeHtml(section.id)+'"><header class="rail-section-head"><strong>여백 구간 '+(index+1)+'</strong><span class="rail-section-actions"><button type="button" data-section-action="up"'+(index===0?' disabled':'')+' aria-label="구간 위로">↑</button><button type="button" data-section-action="down"'+(index===total-1?' disabled':'')+' aria-label="구간 아래로">↓</button><button type="button" data-section-action="delete">삭제</button></span></header><div class="rail-section-range"><label><span>시작 문단</span><input data-section-key="startParagraph" type="number" min="1" max="'+paragraphCount+'" value="'+section.startParagraph+'"></label><span class="rail-range-arrow">→</span><label><span>끝 문단</span><input data-section-key="endParagraph" type="number" min="1" max="'+paragraphCount+'" value="'+section.endParagraph+'"></label><em>전체 '+paragraphCount+'문단</em></div><div class="rail-section-settings"><label><span>위치</span><select data-section-key="side"><option value="left"'+(section.side==='left'?' selected':'')+'>왼쪽</option><option value="right"'+(section.side==='right'?' selected':'')+'>오른쪽</option></select></label><label><span>여백 폭</span><input data-section-key="width" type="number" min="16" max="42" value="'+section.width+'"><em>%</em></label></div>'+warning+'<div class="rail-section-add-actions"><button type="button" data-add-rail="text">＋ 문구</button><button type="button" data-add-rail="image">＋ 이미지</button><button type="button" data-add-rail="divider">＋ 구분선</button></div><p class="rail-shared-note">모바일 위치를 조정하는 중입니다. PC 배치는 그대로 유지됩니다.</p><p class="rail-annotation-title">주석</p><div class="rail-annotation-list" data-rail-annotation-list="true">'+annotationSectionEditorHtml(section)+'</div><div class="rail-items-editor" data-rail-items-editor="true">'+(section.items.length?section.items.map(function(item,itemIndex){return railItemEditorHtml(item,itemIndex,section.items.length,section);}).join(''):'<p class="rail-empty">여백은 비워 둔 채로 사용할 수도 있습니다.</p>')+'</div></article>';}
function refreshRailOverlapWarnings(){if(!railSectionsEditor)return;railSectionsEditor.querySelectorAll('.rail-section-card').forEach(function(card){var section=railSectionById(card.dataset.railSectionId),warning=card.querySelector('.rail-section-warning');if(warning)warning.hidden=!section||!railSectionOverlap(section);});}
function renderRailSectionsEditor(){if(!railSectionsEditor)return;var sections=normalizeDraftRailSections(),count=bodyParagraphCountHtml(editor.innerHTML);railAnnotationSignature='';railSectionsEditor.innerHTML=sections.length?sections.map(function(section,index){return railSectionEditorHtml(section,index,sections.length,count);}).join(''):'<p class="rail-empty">여백 구간이 없습니다.</p>';refreshRailOverlapWarnings();}
function addRailSection(){var count=bodyParagraphCountHtml(editor.innerHTML),occupied={},sections=activeRailSections(),start=0,end,section;sections.forEach(function(existing){for(var p=existing.startParagraph;p<=existing.endParagraph;p++)occupied[p]=true;});for(var i=1;i<=count;i++)if(!occupied[i]){start=i;break;}if(!start){text('saveState','먼저 기존 여백 구간의 범위를 줄여 주세요.');return;}end=start;while(end<count&&!occupied[end+1])end++;section=normalizeRailSection({startParagraph:start,endParagraph:end,side:'left',width:26,topOffset:0,items:[]},count);draft.railSections.push(section);renderRailSectionsEditor();render();var input=railSectionsEditor.querySelector('[data-rail-section-id="'+section.id+'"] [data-section-key="startParagraph"]');if(input)input.focus();}
function addRailItem(sectionId,type){var section=railSectionById(sectionId);if(!section)return;var raw=type==='image'?{type:'image',width:100,align:'center',gapAfter:18}:type==='divider'?{type:'divider',width:100,thickness:1,align:'left',gapAfter:16}:{type:'text',font:'body',size:12,align:'left',gapAfter:16},item=normalizeRailItem(raw);section.items.push(item);renderRailSectionsEditor();render();var card=railSectionsEditor.querySelector('[data-rail-id="'+item.id+'"]'),focus=card&&card.querySelector('textarea,input');if(focus)focus.focus();}
document.getElementById('addRailSection').onclick=addRailSection;
railSectionsEditor.addEventListener('input',function(e){var sectionCard=e.target.closest('[data-rail-section-id]'),section=sectionCard&&railSectionById(sectionCard.dataset.railSectionId);if(!section)return;var sectionKey=e.target.dataset.sectionKey;if(sectionKey){if(e.target.type==='number'&&e.target.value==='')return;section[sectionKey]=e.target.type==='number'?Number(e.target.value):e.target.value;refreshRailOverlapWarnings();render();return;}var itemCard=e.target.closest('[data-rail-id]'),record=itemCard&&railItemRecord(itemCard.dataset.railId);if(!record)return;var gap=e.target.dataset.railGap;if(gap){if(e.target.value==='')return;var value=clampNumber(e.target.value,0,RAIL_TOP_MAX,16),items=record.section.items;setRailGapValue(record,gap,value);syncRailGapInputs(record.section,e.target);render();return;}var key=e.target.dataset.railKey;if(!key)return;if(e.target.type==='number'){if(e.target.value==='')return;record.item[key]=Number(e.target.value);}else record.item[key]=e.target.value;record.section.items[record.itemIndex]=normalizeRailItem(record.item);if(record.item.type==='text'&&key==='font')e.target.style.fontFamily=railTextFont(record.section.items[record.itemIndex]);if(record.item.type==='image'&&key==='url'){var state=itemCard.querySelector('.rail-image-state'),source=normalizeImageSource(record.item.url),remote=/^https:\/\//i.test(source);if(state)state.textContent=localRailImages[record.item.id]?(remote?'로컬 미리보기 · 게시 주소 연결됨':'로컬 미리보기 · HTML 주소 필요'):(remote?'게시 주소 연결됨':source?'HTML 주소 필요':'');}render();});
function normalizeRailNumberInput(target){var itemCard=target.closest('[data-rail-id]'),record=itemCard&&railItemRecord(itemCard.dataset.railId);if(!record)return;var gap=target.dataset.railGap,items=record.section.items,value;if(gap){if(target.value!=='')value=clampNumber(target.value,0,RAIL_TOP_MAX,16);if(gap==='before'&&record.itemIndex>0&&value!==undefined)items[record.itemIndex-1].gapAfter=value;else if(gap==='after'&&record.itemIndex<items.length-1&&value!==undefined)record.item.gapAfter=value;}else if(target.dataset.railKey){if(target.value!=='')record.item[target.dataset.railKey]=Number(target.value);record.section.items[record.itemIndex]=normalizeRailItem(record.item);}renderRailSectionsEditor();render();}
railSectionsEditor.addEventListener('change',function(e){if(e.target.matches('[data-section-key]')){var card=e.target.closest('[data-rail-section-id]'),section=card&&railSectionById(card.dataset.railSectionId),count=bodyParagraphCountHtml(editor.innerHTML);if(section){var normalized=normalizeRailSection(section,count),index=draft.railSections.indexOf(section);draft.railSections[index]=normalized;renderRailSectionsEditor();render();}return;}if(e.target.matches('[data-rail-gap],[data-rail-key][type="number"]')){normalizeRailNumberInput(e.target);return;}if(!e.target.matches('[data-rail-file]'))return;var itemCard=e.target.closest('[data-rail-id]'),record=itemCard&&railItemRecord(itemCard.dataset.railId),file=e.target.files[0];if(!record||!file||!/^image\//.test(file.type))return;var imageMap=localRailImages,owner=activeStory(),collection=storyCollection,id=record.item.id,requests=railImageLoads.get(imageMap);
 if(!requests){requests={};railImageLoads.set(imageMap,requests);}var prior=requests[id];if(prior&&prior.readyState===1)prior.abort();
 var reader=new FileReader(),state=itemCard.querySelector('.rail-image-state');requests[id]=reader;if(state)state.textContent='불러오는 중…';
 function current(){return storyCollection===collection&&storyCollection.stories.indexOf(owner)>=0&&requests[id]===reader&&owner.data.railSections.some(function(section){return section.items.some(function(item){return item.id===id;});});}
 reader.onload=function(){if(!current())return;delete requests[id];imageMap[id]=reader.result;if(state)state.textContent=/^https:\/\//i.test(normalizeImageSource(record.item.url))?'로컬 미리보기 · 게시 주소 연결됨':'로컬 미리보기 · HTML 주소 필요';if(owner===activeStory())render();};
 reader.onerror=function(){if(!current())return;delete requests[id];if(state)state.textContent='파일을 읽지 못했습니다';};reader.readAsDataURL(file);});
railSectionsEditor.addEventListener('focusout',function(e){if(e.target.matches('[data-rail-gap],[data-rail-key][type="number"]'))normalizeRailNumberInput(e.target);});
railSectionsEditor.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;var sectionCard=button.closest('[data-rail-section-id]'),section=sectionCard&&railSectionById(sectionCard.dataset.railSectionId);if(!section)return;var annotationRow=button.closest('[data-annotation-row]');if(annotationRow&&button.dataset.annotationAction){var noteItem=annotationById(annotationRow.dataset.annotationRow);if(!noteItem)return;if(button.dataset.annotationAction==='reset'){if(annotationOffset(noteItem)){setAnnotationOffset(noteItem,0);render();}}else adjustAnnotationOffset(noteItem,(button.dataset.annotationAction==='up'?-1:1)*imageLinePixels());selectAnnotation(noteItem.id);return;}if(button.dataset.addRail){addRailItem(section.id,button.dataset.addRail);return;}var sectionAction=button.dataset.sectionAction,sectionIndex=draft.railSections.indexOf(section);if(sectionAction){if(sectionAction==='delete'){section.items.forEach(function(item){delete localRailImages[item.id];});draft.railSections.splice(sectionIndex,1);}else if(sectionAction==='up'&&sectionIndex>0){draft.railSections.splice(sectionIndex-1,0,draft.railSections.splice(sectionIndex,1)[0]);}else if(sectionAction==='down'&&sectionIndex<draft.railSections.length-1){draft.railSections.splice(sectionIndex+1,0,draft.railSections.splice(sectionIndex,1)[0]);}renderRailSectionsEditor();render();return;}var itemCard=button.closest('[data-rail-id]'),record=itemCard&&railItemRecord(itemCard.dataset.railId);if(!record)return;var action=button.dataset.railAction,toggle=button.dataset.railToggle;if(action==='delete'){delete localRailImages[record.item.id];record.section.items.splice(record.itemIndex,1);renderRailSectionsEditor();render();return;}if(action==='up'&&record.itemIndex>0){moveRailItem(record.section,record.itemIndex,record.itemIndex-1);renderRailSectionsEditor();render();return;}if(action==='down'&&record.itemIndex<record.section.items.length-1){moveRailItem(record.section,record.itemIndex,record.itemIndex+1);renderRailSectionsEditor();render();return;}if(toggle){record.item[toggle]=!record.item[toggle];button.classList.toggle('is-active',record.item[toggle]);button.setAttribute('aria-pressed',String(record.item[toggle]));render();}});
railSectionsEditor.addEventListener('dragstart',function(e){var handle=e.target.closest('.rail-drag'),card=handle&&handle.closest('[data-rail-id]');if(!card)return;draggedRailItemId=card.dataset.railId;draggedRailSectionId=card.dataset.railSectionId;card.classList.add('is-dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',draggedRailItemId);});
railSectionsEditor.addEventListener('dragover',function(e){if(!draggedRailItemId)return;var card=e.target.closest('[data-rail-id]');if(!card||card.dataset.railSectionId!==draggedRailSectionId)return;e.preventDefault();railSectionsEditor.querySelectorAll('.rail-item').forEach(function(x){x.classList.toggle('is-drop-target',x===card);});});
railSectionsEditor.addEventListener('drop',function(e){if(!draggedRailItemId)return;var target=e.target.closest('[data-rail-id]'),record=railItemRecord(draggedRailItemId),targetRecord=target&&railItemRecord(target.dataset.railId);if(!record||!targetRecord||record.section!==targetRecord.section)return;e.preventDefault();var from=record.itemIndex,to=targetRecord.itemIndex,after=e.clientY>target.getBoundingClientRect().top+target.getBoundingClientRect().height/2;if(from<to)to--;if(after)to++;moveRailItem(record.section,from,to);draggedRailItemId='';draggedRailSectionId='';renderRailSectionsEditor();render();});
railSectionsEditor.addEventListener('dragend',function(){draggedRailItemId='';draggedRailSectionId='';railSectionsEditor.querySelectorAll('.rail-item').forEach(function(x){x.classList.remove('is-dragging','is-drop-target');});});
renderRailSectionsEditor();
var publicationProof=document.getElementById('publicationProof'),railPositionToggle=document.getElementById('railPositionToggle'),railPositionEditing=false,railPreviewDrag=null,railMeasureFrame=0;
publicationProof.addEventListener('toggle',function(e){
 var disclosure=publicationDisclosure();
 if(e.target!==disclosure||!draft.publicationToggle||disclosure.open===publicationIsOpen(true))return;
 previewPublicationOpen=disclosure.open;
 if(!disclosure.open){if(railPositionEditing)setRailPositionEditing(false);if(paper&&paper.classList.contains('edit-mode'))setPreviewEditing(false);}
 else{scheduleRailMeasurementSync();scheduleAnnotationLayout();}
},true);
function railPreviewItems(root){return Array.prototype.slice.call((root||publicationProof).querySelectorAll('.rail-preview-item[data-rail-id]'));}
function syncRailMeasuredHeights(){return withExpandedPublication(measureRailHeights);}
function measureRailHeights(){var changed=false;railPreviewItems().forEach(function(el){var item=railItemById(el.dataset.railId),height=Math.max(1,Math.round(el.getBoundingClientRect().height));if(item&&item.measuredHeight!==height){item.measuredHeight=height;changed=true;}});return changed;}
function scheduleRailMeasurementSync(){if(railMeasureFrame)cancelAnimationFrame(railMeasureFrame);railMeasureFrame=requestAnimationFrame(function(){railMeasureFrame=0;if(!syncRailMeasuredHeights())return;var output=document.getElementById('htmlOutput');if(output)output.value=makeHtml(false);save();});}
function clearRailPreviewDrag(){railPreviewItems().forEach(function(el){el.classList.remove('is-rail-dragging');el.style.transform='';el.setAttribute('aria-grabbed','false');});}
function refreshRailPositionMode(){var available=!!publicationProof.querySelector('.publication-rail-cell .rail-preview-item,.publication-rail-cell .publication-annotation-note');if(!available)railPositionEditing=false;publicationProof.classList.toggle('rail-position-mode',railPositionEditing&&available);railPositionToggle.disabled=!available;railPositionToggle.classList.toggle('is-active',railPositionEditing&&available);railPositionToggle.setAttribute('aria-pressed',String(railPositionEditing&&available));railPositionToggle.textContent=railPositionEditing&&available?'위치 조정 종료':'위치 조정';railPreviewItems().forEach(function(el){el.setAttribute('aria-grabbed','false');});}
function setRailPositionEditing(on){if(on)openPublicationPreview();if(on&&paper&&paper.classList.contains('edit-mode'))setPreviewEditing(false);railPreviewDrag=null;clearRailPreviewDrag();railPositionEditing=!!on;refreshRailPositionMode();}
function railPreviewDragDelta(state,clientY){var scroller=document.querySelector('.preview-area'),scrollDelta=scroller?scroller.scrollTop-state.startScroll:0;return Math.round(clientY-state.startY+scrollDelta);}
function adjustRailItemWithinGap(record,delta){var items=record.section.items,index=record.itemIndex,before=index>0?railGapAfter(items[index-1]):null,after=index<items.length-1?railGapAfter(items[index]):null,top=railTopOffset(record.section),shift;if(index===0&&after!==null){shift=clampNumber(delta,-top,after,0);setRailTopOffset(record.section,top+shift);setRailGapAfter(items[0],after-shift);return shift!==0;}if(index===0){shift=clampNumber(delta,-top,RAIL_TOP_MAX-top,0);setRailTopOffset(record.section,top+shift);return shift!==0;}if(before!==null&&after!==null){shift=clampNumber(delta,-before,after,0);setRailGapAfter(items[index-1],before+shift);setRailGapAfter(items[index],after-shift);return shift!==0;}if(before!==null){shift=clampNumber(delta,-before,RAIL_TOP_MAX-before,0);setRailGapAfter(items[index-1],before+shift);return shift!==0;}return false;}
function finishRailPreviewDrag(clientY,commit){if(!railPreviewDrag)return;var state=railPreviewDrag,record=railItemRecord(state.itemId),delta=railPreviewDragDelta(state,clientY),cell=state.cell;railPreviewDrag=null;clearRailPreviewDrag();if(!commit||!record){refreshRailPositionMode();return;}var others=railPreviewItems(cell).filter(function(el){return el.dataset.railId!==record.item.id;}),target=others.find(function(el){var rect=el.getBoundingClientRect();return clientY<rect.top+rect.height/2;}),to=target?(railItemRecord(target.dataset.railId)||{}).itemIndex:record.section.items.length-1;if(!Number.isFinite(to))to=record.itemIndex;if(record.itemIndex<to)to--;if(target===undefined)to=record.section.items.length-1;if(to!==record.itemIndex)moveRailItem(record.section,record.itemIndex,to);else adjustRailItemWithinGap(record,delta);renderRailSectionsEditor();render();}
railPositionToggle.onclick=function(){if(this.disabled)return;setRailPositionEditing(!railPositionEditing);};
publicationProof.addEventListener('pointerdown',function(e){if(!railPositionEditing||e.button!==0)return;var el=e.target.closest('.rail-preview-item[data-rail-id]'),cell=el&&el.closest('.publication-rail-cell[data-rail-section-id]'),record=el&&railItemRecord(el.dataset.railId);if(!el||!cell||!record||record.section.id!==cell.dataset.railSectionId)return;var scroller=document.querySelector('.preview-area');railPreviewDrag={itemId:record.item.id,sectionId:record.section.id,pointerId:e.pointerId,startY:e.clientY,startScroll:scroller?scroller.scrollTop:0,source:el,cell:cell};el.classList.add('is-rail-dragging');el.setAttribute('aria-grabbed','true');try{el.setPointerCapture(e.pointerId);}catch(err){}e.preventDefault();});
publicationProof.addEventListener('pointermove',function(e){if(!railPreviewDrag||e.pointerId!==railPreviewDrag.pointerId)return;e.preventDefault();railPreviewDrag.source.style.transform='translateY('+railPreviewDragDelta(railPreviewDrag,e.clientY)+'px)';});
publicationProof.addEventListener('pointerup',function(e){if(!railPreviewDrag||e.pointerId!==railPreviewDrag.pointerId)return;e.preventDefault();finishRailPreviewDrag(e.clientY,true);});
publicationProof.addEventListener('pointercancel',function(e){if(!railPreviewDrag||e.pointerId!==railPreviewDrag.pointerId)return;finishRailPreviewDrag(e.clientY,false);});
publicationProof.addEventListener('load',function(e){if(!e.target||e.target.tagName!=='IMG')return;if(e.target.matches('[data-hero-image]')&&e.target.naturalWidth>0&&e.target.naturalHeight>0){var aspect=Math.round(e.target.naturalHeight/e.target.naturalWidth*10000)/100;if(Math.abs(clampNumber(draft.heroAspect,20,180,56.25)-aspect)>.05){draft.heroAspect=clampNumber(aspect,20,180,56.25);render();return;}}scheduleRailMeasurementSync();},true);
function allRailItems(){var sections=Array.isArray(draft.railSections)?draft.railSections:[];return sections.length?sections.reduce(function(items,section){return items.concat(section.items||[]);},[]):(Array.isArray(draft.railItems)?draft.railItems:[]);}
function missingPublishImageCount(){var count=localHero&&!/^https:\/\//i.test(normalizeImageSource(draft.heroImageUrl))?1:0;allRailItems().forEach(function(item){if(item.type!=='image')return;var src=localRailImages[item.id]||normalizeImageSource(item.url);if(src&&!/^https:\/\//i.test(normalizeImageSource(item.url)))count++;});var box=document.createElement('div');box.innerHTML=editor.innerHTML;box.querySelectorAll('.editor-image-block,.body-image').forEach(function(fig){if(fig.dataset.blank==='true')return;var img=fig.querySelector('img'),visible=img&&normalizeImageSource(img.getAttribute('src')||''),remote=normalizeImageSource(fig.dataset.exportUrl||'');if(visible&&!/^https:\/\//i.test(remote))count++;});return count;}
function hasPreviewOnlyImageView(){var box=document.createElement('div');box.innerHTML=editor.innerHTML;return Array.prototype.some.call(box.querySelectorAll('.editor-image-block,.body-image'),function(fig){return fig.dataset.blank!=='true'&&clampNumber(fig.dataset.zoom,100,300,100)!==100;});}
function flashButtonLabel(button,message,ms){if(!button)return;
 if(button.dataset.idleLabel===undefined)button.dataset.idleLabel=button.textContent;
 button.textContent=message;
 if(button.labelResetTimer)clearTimeout(button.labelResetTimer);
 button.labelResetTimer=setTimeout(function(){button.textContent=button.dataset.idleLabel;button.labelResetTimer=0;},ms||1400);}
async function copy(button){
 syncRailMeasuredHeights();
 var missing=missingPublishImageCount();
 if(missing){text('saveState','이미지 '+missing+'개 · 아카라이브용 HTTPS 주소 필요');flashButtonLabel(button,'이미지 주소 필요',1600);return;}
 var value=makeHtml(),copied=false;
 if(navigator.clipboard&&navigator.clipboard.writeText){try{await navigator.clipboard.writeText(value);copied=true;}catch(err){copied=false;}}
 if(!copied){
  var field=document.createElement('textarea');
  field.value=value;field.readOnly=true;field.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;padding:0;border:0;opacity:.01;';
  document.body.appendChild(field);field.focus();field.select();field.setSelectionRange(0,field.value.length);
  try{copied=document.execCommand('copy')===true;}catch(err){copied=false;}
  field.remove();
 }
 if(copied){flashButtonLabel(button,'복사 완료');text('saveState',hasPreviewOnlyImageView()?'HTML 복사 완료 · 본문 이미지 확대는 미리보기 전용':'HTML 복사 완료');}
 else{flashButtonLabel(button,'복사 실패');text('saveState','복사 실패 · HTML 보기에서 내용을 직접 선택해 복사하세요.');}
}
function downloadDraft(data,name){data=storyDocument();var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name||'letter-log-draft.json';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
function importedSingleDraft(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw)||typeof raw.bodyHtml!=='string')throw new Error('invalid');var next=Object.assign({},defaults);Object.keys(defaults).forEach(function(key){if(Object.prototype.hasOwnProperty.call(raw,key))next[key]=raw[key];});if(raw.showLogMeta===undefined&&raw.showInfo!==undefined)next.showLogMeta=!!raw.showInfo;if(raw.showComment===undefined&&raw.showInfo!==undefined)next.showComment=!!raw.showInfo;next.titleFont=safeTitleFontKey(next.titleFont);next.titleAlign=titleAlignMode(next.titleAlign);next.bodyFont=safeBodyFontKey(next.bodyFont);migrateHeaderColors(raw,next);next.railItems=Array.isArray(raw.railItems)?raw.railItems.map(normalizeRailItem):legacyRailItems(next);next.railSections=migrateRailSections(raw,next);next.annotations=normalizeAnnotations(raw.annotations);normalizePublicationToggle(next);next.storyTitle=String(raw.storyTitle===undefined?raw.title||'':raw.storyTitle);next.storyTitleAlign=contentsAlign(next.storyTitleAlign);return next;}
 var mobileViewToggle=document.getElementById('mobileViewToggle'),mobileWidthOptions=document.querySelector('.mobile-width-options'),
     mobileViewOn=false;
 function mobileAnchorWidth(){return clampNumber(draft.mobileAnchorWidth,280,560,375);}
 function mobileColumnWidth(){return Math.round(mobileAnchorWidth()*ARCA_COLUMN_RATIO);}
 function applyMobileViewWidth(){if(!publicationProof)return;
  if(mobileViewOn)publicationProof.style.setProperty('width',mobileColumnWidth()+'px','important');
  else publicationProof.style.removeProperty('width');}
 function setMobileView(on){
  mobileViewOn=!!on;
  if(mobileViewOn&&railPositionEditing)setRailPositionEditing(false);
  document.body.classList.toggle('mobile-view-on',mobileViewOn);
  if(mobileWidthOptions)mobileWidthOptions.hidden=!mobileViewOn;
  mobileViewToggle.classList.toggle('is-active',mobileViewOn);
  mobileViewToggle.setAttribute('aria-pressed',String(mobileViewOn));
  mobileViewToggle.textContent=mobileViewOn?'모바일 보기 종료':'모바일 보기';
  applyMobileViewWidth();
  (Array.isArray(draft.railSections)?draft.railSections:[]).forEach(function(section){syncRailGapInputs(section);});
  render();}
 mobileViewToggle.onclick=function(){setMobileView(!mobileViewOn);};
 if(mobileWidthOptions)mobileWidthOptions.querySelectorAll('[data-mobile-width]').forEach(function(button){button.onclick=function(){
  storyCollection.common.mobileAnchorWidth=clampNumber(button.dataset.mobileWidth,280,560,375);applyCommonSettings(storyCollection);
  mobileWidthOptions.querySelectorAll('[data-mobile-width]').forEach(function(other){other.classList.toggle('is-active',other===button);});
  applyMobileViewWidth();render();};});
 var modal=document.getElementById('modal');document.getElementById('htmlBtn').onclick=function(){syncRailMeasuredHeights();document.getElementById('htmlOutput').value=makeHtml();if(hasPreviewOnlyImageView())text('saveState','본문 이미지 확대는 미리보기 전용 · 지정한 높이와 초점은 HTML에도 적용');modal.hidden=false;};document.getElementById('closeBtn').onclick=function(){modal.hidden=true;};document.getElementById('copyBtn').onclick=function(){copy(this);};document.getElementById('modalCopyBtn').onclick=function(){copy(this);};document.getElementById('backupBtn').onclick=function(){syncRailMeasuredHeights();downloadDraft(draft,'letter-log-draft.json');};document.getElementById('restoreBtn').onclick=function(){document.getElementById('restoreFile').click();};document.getElementById('restoreFile').onchange=function(e){var file=e.target.files[0],input=this;if(!file)return;var reader=new FileReader();text('saveState','백업 확인 중…');reader.onload=function(){try{var next=importedDraft(JSON.parse(reader.result)),stamp=new Date().toISOString().slice(0,10);syncRailMeasuredHeights();downloadDraft(draft,'불러오기-이전-자동백업-'+stamp+'.json');localStorage.setItem(KEY,JSON.stringify(next));text('saveState','불러오기 완료');setTimeout(function(){location.reload();},250);}catch(err){text('saveState','불러오기 실패 · 올바른 백업 JSON인지 확인하세요.');input.value='';}};reader.onerror=function(){text('saveState','파일을 읽지 못했습니다.');input.value='';};reader.readAsText(file);};render();
document.querySelectorAll('[data-thought]').forEach(function(b){b.addEventListener('click',function(){var s=window.getSelection(),n=s.anchorNode&&s.anchorNode.nodeType===3?s.anchorNode.parentElement:s.anchorNode,q=n&&n.closest?n.closest('blockquote'):null;if(q){q.classList.add('thought');render();}});});

/* Direct editing in the large preview */
 var previewBody=document.getElementById('publicationEditBody'),paper=publicationProof,editToggle=document.getElementById('previewEditToggle'),formatTools=document.querySelector('.preview-format-tools'),imageTools=document.getElementById('previewImageTools'),dropGuide=document.getElementById('imageDropGuide'),selectedPreviewImage=null,previewRange=null,draggedPreviewImage=null,pointerDragStart=null,pointerDragging=false,pendingPreviewImage='',previewImageReader=null,previewImageLoadId=0,previewScrollRestoreId=0;
function effectiveLayout(fig){return resolvedLayout(fig);}
function previewProseRegions(root){root=root||previewBody;if(!root)return[];var regions=Array.prototype.slice.call(root.querySelectorAll('[data-body-segment-prose="true"]'));return regions.length?regions:[root];}
function previewFlowBlocks(root){return previewProseRegions(root).reduce(function(blocks,region){return blocks.concat(Array.prototype.slice.call(region.children));},[]);}
function previewRegionForNode(node){if(!previewBody)return null;var element=node&&node.nodeType===1?node:node&&node.parentElement,region=element&&element.closest&&element.closest('[data-body-segment-prose="true"]');return region&&previewBody.contains(region)?region:previewBody;}
function flattenPreviewSegments(clone){if(!clone.querySelector('[data-body-segment]'))return;var fragment=document.createDocumentFragment();Array.prototype.slice.call(clone.children).forEach(function(child){if(child.hasAttribute('data-body-segment')){var prose=child.querySelector('[data-body-segment-prose="true"]');if(prose)while(prose.firstChild)fragment.appendChild(prose.firstChild);}else if(!child.matches('[data-body-segment-clear]')&&!(child.style&&child.style.clear==='both'&&!child.textContent.trim()))fragment.appendChild(child);});clone.innerHTML='';clone.appendChild(fragment);}
 function refreshPreviewImages(){if(!previewBody)return;var editing=paper.classList.contains('edit-mode'),figures=Array.prototype.slice.call(previewBody.querySelectorAll('.body-image'));figures.forEach(function(fig){var layout=effectiveLayout(fig),width=Number(fig.dataset.width)||45,next=fig.nextElementSibling;fig.dataset.layout=layout;fig.className='body-image layout-'+layout+(fig===selectedPreviewImage?' selected':'');fig.style.width=(layout==='full'?100:width)+'%';if(layout==='left'){fig.style.marginLeft='0';fig.style.marginRight='min(28px, calc(100% - '+width+'%))';}else if(layout==='right'){fig.style.marginLeft='min(28px, calc(100% - '+width+'%))';fig.style.marginRight='0';}else{fig.style.removeProperty('margin-left');fig.style.removeProperty('margin-right');}var segment=fig.closest('[data-body-segment]');applyFullImageBleed(fig,segment?railSectionById(segment.dataset.bodySegment):null);fig.draggable=false;fig.setAttribute('contenteditable','false');applyImageView(fig,false);applyImageLineOffset(fig);applyCaptionStyle(fig,false);var img=fig.querySelector('img');if(img){img.draggable=false;img.referrerPolicy='no-referrer';}fig.querySelectorAll('figcaption').forEach(function(cap){cap.setAttribute('contenteditable',editing?'true':'false');});});}
function previewToSource(){if(!previewBody)return;normalizeImageFlows(previewBody);var clone=previewBody.cloneNode(true);stripDerivedAnnotationUi(clone);clone.removeAttribute('contenteditable');clone.removeAttribute('id');flattenPreviewSegments(clone);restoreAutoSource(clone);normalizeParagraphAlignment(clone);normalizePlainDivs(clone,false);clone.querySelectorAll('[data-image-caret]').forEach(function(node){if(blankParagraph(node))node.remove();else node.removeAttribute('data-image-caret');});clone.querySelectorAll('.body-image').forEach(function(fig){var layout=resolvedLayout(fig),width=Number(fig.dataset.width)||45,view=imageView(fig),url=(fig.querySelector('img')||{}).src||'',top=(fig.querySelector('.caption-top')||{}).textContent||'',bottom=(fig.querySelector('.caption-bottom')||fig.querySelector('figcaption')||{}).textContent||'',holder=document.createElement('div');holder.innerHTML=imageBlock(url,top,bottom,layout,width,view.zoom,view.focusX,view.focusY,fig.dataset.captionFont||'body',fig.dataset.captionBold==='true',fig.dataset.captionItalic==='true',imageLineOffset(fig),fig.dataset.exportUrl||'',captionSetting(fig,'Top','Font','body'),captionSetting(fig,'Top','Bold','false'),captionSetting(fig,'Top','Italic','false'),captionSetting(fig,'Top','Size',10),captionSetting(fig,'Bottom','Font','body'),captionSetting(fig,'Bottom','Bold','false'),captionSetting(fig,'Bottom','Italic','false'),captionSetting(fig,'Bottom','Size',10),Number(fig.dataset.lineIndex),fig.dataset.blank==='true',imageHeight(fig));fig.replaceWith(holder.firstElementChild);});clone.querySelectorAll('p,h2,h3,h4,h5,h6,blockquote,li,hr,strong,em,s,code,a').forEach(function(x){var centered=x.matches('p,h2,h3,h4,h5,h6,blockquote,li')&&centeredBodyBlock(x);x.removeAttribute('style');if(centered)x.style.textAlign='center';});clone.querySelectorAll('[contenteditable]').forEach(function(x){x.removeAttribute('contenteditable');});editor.innerHTML=clone.innerHTML;ensureEditorBlock();draft.bodyHtml=editor.innerHTML;normalizeDraftRailSections();save();document.getElementById('htmlOutput').value=makeHtml();refreshRailAnnotationRows();}
function setImageControl(id,value){var range=document.getElementById(id),number=document.getElementById(id+'Number');range.value=value;number.value=value;paintRange(range);}
function selectPreviewImage(fig){if(selectedPreviewImage)selectedPreviewImage.classList.remove('selected');if(fig&&(!previewBody||!previewBody.contains(fig)))fig=null;selectedPreviewImage=fig;if(!fig){imageTools.hidden=true;return;}fig.classList.add('selected');imageTools.hidden=false;var view=imageView(fig),layout=resolvedLayout(fig),img=fig.querySelector('img'),localUrl=img&&img.getAttribute('src')||'',lineIndex=Number.isFinite(Number(fig.dataset.lineIndex))?Number(fig.dataset.lineIndex):imageLineOffset(fig);fig.dataset.lineIndex=String(lineIndex);document.getElementById('selectedImageLayout').value=layout;document.querySelectorAll('[data-selected-layout]').forEach(function(button){var active=button.dataset.selectedLayout===layout;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});setImageControl('selectedImageWidth',Number(fig.dataset.width)||45);syncSelectedImageHeight(fig);setImageControl('selectedImageZoom',view.zoom);setImageControl('selectedImageFocusX',view.focusX);setImageControl('selectedImageFocusY',view.focusY);document.getElementById('selectedImageLineValue').textContent=lineIndex+'줄';document.getElementById('selectedImageExportUrl').value=fig.dataset.exportUrl||(/^https:\/\//i.test(localUrl)?localUrl:'');['Top','Bottom'].forEach(function(side){document.getElementById('selectedImageCaption'+side).value=(fig.querySelector(side==='Top'?'.caption-top':'.caption-bottom')||{}).textContent||'';var captionKey=captionSetting(fig,side,'Font','body');document.getElementById('selectedImageCaption'+side+'Font').value=captionKey==='body'?'body':safeBodyFontKey(captionKey);document.getElementById('selectedImageCaption'+side+'Size').value=clampNumber(captionSetting(fig,side,'Size',10),7,24,10);[['Bold','Bold'],['Italic','Italic']].forEach(function(pair){var pressed=captionSetting(fig,side,pair[1],'false')==='true',button=document.getElementById('selectedImageCaption'+side+pair[0]);button.classList.toggle('is-active',pressed);button.setAttribute('aria-pressed',String(pressed));});});}
function previewScrollSnapshot(){var scroller=document.querySelector('.preview-area');return{scroller:scroller,top:scroller?scroller.scrollTop:0,left:scroller?scroller.scrollLeft:0,pageX:window.scrollX,pageY:window.scrollY};}
function restorePreviewScroll(snapshot){if(!snapshot)return;var token=++previewScrollRestoreId,apply=function(){if(token!==previewScrollRestoreId)return;if(snapshot.scroller){snapshot.scroller.scrollTop=snapshot.top;snapshot.scroller.scrollLeft=snapshot.left;}if(window.scrollX!==snapshot.pageX||window.scrollY!==snapshot.pageY)window.scrollTo(snapshot.pageX,snapshot.pageY);};apply();requestAnimationFrame(function(){apply();requestAnimationFrame(apply);});}
function focusPreviewBody(){if(!previewBody)return;try{previewBody.focus({preventScroll:true});}catch(e){previewBody.focus();}}
function applyPreviewEditableHosts(on){if(!previewBody)return;var regions=previewProseRegions();previewBody.removeAttribute('contenteditable');regions.forEach(function(region){region.contentEditable=on?'true':'false';});previewBody.querySelectorAll('.publication-rail-cell').forEach(function(cell){cell.contentEditable='false';});}
function setPreviewEditing(on){if(on)openPublicationPreview();var scroll=previewScrollSnapshot();paper.classList.toggle('edit-mode',on);applyPreviewEditableHosts(on);editToggle.setAttribute('aria-pressed',String(on));editToggle.textContent=on?'편집 종료':'편집 활성화';formatTools.dataset.editDisabled=String(!on);if(!on){selectPreviewImage(null);closeImageInsert();previewRange=null;previewToSource();render();renderRailSectionsEditor();}else{ensurePreviewParagraph();refreshPreviewImages();updateToolbarState();}restorePreviewScroll(scroll);}
function capturePreviewRange(){var s=window.getSelection();if(s.rangeCount&&previewBody.contains(s.anchorNode))previewRange=s.getRangeAt(0).cloneRange();}
function previewRangeIsValid(){return previewRange&&previewBody.contains(previewRange.commonAncestorContainer);}
function ensurePreviewRange(){
 var range=previewRangeIsValid()?previewRange.cloneRange():null,region=range?previewRegionForNode(range.startContainer):(previewProseRegions()[0]||previewBody);
 if(!range){range=document.createRange();range.selectNodeContents(region);range.collapse(true);}
 // Focusing an editable host can change the live selection; retain the saved range first.
 try{region.focus({preventScroll:true});}catch(e){region.focus();}
 var selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);previewRange=range.cloneRange();return range;
}
function restorePreviewRange(){ensurePreviewRange();}
function placeCaretAtEnd(node){var range=document.createRange();range.selectNodeContents(node);range.collapse(false);var s=window.getSelection();s.removeAllRanges();s.addRange(range);previewRange=range.cloneRange();}
function insertPreviewBlock(html){
 var range=ensurePreviewRange();range.collapse(false);
 var region=previewRegionForNode(range.startContainer),anchor=range.startContainer,template=document.createElement('template');template.innerHTML=html;
 var first=template.content.firstElementChild;if(!first)return null;
 if(anchor===region){region.insertBefore(first,region.childNodes[range.startOffset]||null);}
 else{
  if(anchor.nodeType===3)anchor=anchor.parentNode;
  while(anchor&&anchor.parentNode!==region)anchor=anchor.parentNode;
  if(imageTextBlock(anchor))insertImageIntoText(first,anchor,safeImageTextBoundary(anchor,{node:range.startContainer,offset:range.startOffset},true));
  else if(anchor&&anchor.parentNode===region)anchor.after(first);else region.appendChild(first);
 }
 var next=first.nextElementSibling;
 if(!next||!next.matches('p,blockquote,h2,h3,h4,h5,h6,ul,ol')){next=document.createElement('p');next.dataset.imageCaret='true';next.innerHTML='<br>';first.after(next);}
 syncPreviewWithoutReset();placePreviewCaret(next,false);updateToolbarState();return first;
}
function placePreviewCaret(node,atEnd){
 var region=previewRegionForNode(node);try{region.focus({preventScroll:true});}catch(e){region.focus();}
 var range=document.createRange();range.selectNodeContents(node);range.collapse(!atEnd);
 var selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);previewRange=range.cloneRange();
}
function previewAlignmentBlocks(range){
 if(!previewBody||!range||!previewBody.contains(range.commonAncestorContainer))return[];
 var start=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement,
     end=range.endContainer.nodeType===1?range.endContainer:range.endContainer.parentElement;
 if(start.closest('figure,[data-rail-container],[data-annotation-inline-note]')||end.closest('figure,[data-rail-container],[data-annotation-inline-note]'))return[];
 var candidates=Array.prototype.slice.call(previewBody.querySelectorAll('p,blockquote,h2,h3,h4,h5,h6,li'));
 var selected=candidates.filter(function(block){
  if(block.closest('figure,[data-rail-container],[data-annotation-inline-note]')||block.querySelector('p,blockquote,h2,h3,h4,h5,h6,li'))return false;
  if(range.collapsed)return block===start||block.contains(start);
  if(!range.intersectsNode(block))return false;
  var intersection=document.createRange();intersection.selectNodeContents(block);
  if(block.contains(range.startContainer))intersection.setStart(range.startContainer,range.startOffset);
  if(block.contains(range.endContainer))intersection.setEnd(range.endContainer,range.endOffset);
  return !intersection.collapsed&&(intersection.toString().length>0||!!intersection.cloneContents().querySelector("br"));
 });
 // Images can split one source paragraph into several visible fragments.
 return candidates.filter(function(block){return selected.indexOf(block)!==-1||(block.dataset.imageFlowId&&selected.some(function(part){return part.dataset.imageFlowId===block.dataset.imageFlowId&&part.parentNode===block.parentNode;}));});
}
function refreshPreviewTextAlignment(){
 if(!previewBody)return;
 previewBody.querySelectorAll('p,blockquote,h2,h3,h4,h5,h6,li').forEach(function(block){
  if(block.closest('figure,[data-rail-container],[data-annotation-inline-note]'))return;
  if(centeredBodyBlock(block))block.style.textIndent='0';
  else if(block.tagName==='P')block.style.textIndent=(block.dataset.imageContinuation==='true'?0:activeIndent())+'px';
 });
}
function updatePreviewCenterButton(){
 var button=document.getElementById('previewCenterText'),blocks=previewAlignmentBlocks(previewRange),active=blocks.length>0&&blocks.every(function(block){return centeredBodyBlock(block);});
 button.disabled=!blocks.length;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));
}
function updateToolbarState(){if(!paper.classList.contains('edit-mode'))return;updatePreviewCenterButton();document.querySelectorAll('[data-preview-command="bold"],[data-preview-command="italic"]').forEach(function(b){var active=false;try{active=document.queryCommandState(b.dataset.previewCommand);}catch(e){}b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});}
function cancelPreviewImageLoad(){
 previewImageLoadId++;if(previewImageReader&&previewImageReader.readyState===1)previewImageReader.abort();previewImageReader=null;
 pendingPreviewImage='';document.getElementById('previewImageAdd').disabled=false;
}
function closeImageInsert(){
 var panel=document.getElementById('previewImageInsert'),button=document.getElementById('previewImageBtn');panel.hidden=true;button.setAttribute('aria-expanded','false');
 cancelPreviewImageLoad();document.getElementById('previewImageFile').value='';document.getElementById('previewImageUrl').value='';text('previewImageState','');
}
function ensurePreviewParagraph(){if(!previewBody||!paper||!paper.classList.contains('edit-mode'))return false;var touched=false;
 previewProseRegions().forEach(function(region){
  var last=region.lastElementChild;if(last&&last.matches('figure,hr')){var after=document.createElement('p');after.dataset.imageCaret='true';after.innerHTML='<br>';region.appendChild(after);touched=true;}
  if(region.querySelector('p,blockquote,h2,h3,h4,h5,h6,hr,figure,ul,ol'))return;
  if(String(region.textContent||'').replace(/​/g,'').trim())return;
  var sel=window.getSelection(),inside=!!(sel&&sel.rangeCount&&region.contains(sel.anchorNode));
  region.innerHTML='<p><br></p>';touched=true;
  if(inside&&region.firstChild){var range=document.createRange();range.setStart(region.firstChild,0);range.collapse(true);sel.removeAllRanges();sel.addRange(range);}
 });
 return touched;}
function syncPreviewWithoutReset(){refreshPreviewTextAlignment();refreshPreviewImages();pruneOrphanAnnotations(previewBody);ensurePreviewParagraph();previewToSource();if(selectedPreviewImage&&!previewBody.contains(selectedPreviewImage))selectPreviewImage(null);}
editToggle.onclick=function(){if(railPositionEditing)setRailPositionEditing(false);setPreviewEditing(!paper.classList.contains('edit-mode'));};
function previewEventInside(e){return!!(previewBody&&e.target&&(e.target===previewBody||previewBody.contains(e.target)));}
['keyup','mouseup','focusin'].forEach(function(ev){publicationProof.addEventListener(ev,function(e){if(!previewEventInside(e))return;capturePreviewRange();updateToolbarState();});});
document.addEventListener('selectionchange',function(){if(paper.classList.contains('edit-mode')){capturePreviewRange();updateToolbarState();}});
document.querySelectorAll('.tool-button.edit-only').forEach(function(button){button.addEventListener('mousedown',function(e){e.preventDefault();});});
publicationProof.addEventListener('input',function(e){if(previewEventInside(e)){if(!e.target.closest('figcaption'))selectPreviewImage(null);syncPreviewWithoutReset();}});
document.querySelectorAll('[data-preview-command]').forEach(function(b){b.onclick=function(){if(!paper.classList.contains('edit-mode'))return;restorePreviewRange();document.execCommand(b.dataset.previewCommand,false,null);capturePreviewRange();syncPreviewWithoutReset();updateToolbarState();};});
document.getElementById('previewCenterText').onclick=function(){
 if(!paper.classList.contains('edit-mode'))return;
 var range=ensurePreviewRange(),blocks=previewAlignmentBlocks(range);if(!blocks.length)return;
 var command=blocks.every(function(block){return centeredBodyBlock(block);})?'justifyFull':'justifyCenter';
 var original=range.cloneRange(),expanded=range.cloneRange(),first=blocks[0],last=blocks[blocks.length-1],selection=window.getSelection();
 expanded.setStart(first,0);
 expanded.setEnd(last,last.childNodes.length);
 var markers=[],notes=[];blocks.forEach(function(block){
  block.querySelectorAll('[data-annotation-marker]').forEach(function(marker){markers.push(marker);marker.setAttribute('contenteditable','true');});
  block.querySelectorAll('[data-annotation-inline-note]').forEach(function(note){notes.push({node:note,style:note.getAttribute('style')});note.style.setProperty('display','none','important');});
 });
 selection.removeAllRanges();selection.addRange(expanded);
 try{document.execCommand(command,false,null);}finally{
  markers.forEach(function(marker){marker.setAttribute('contenteditable','false');});
  notes.forEach(function(note){if(note.style===null)note.node.removeAttribute('style');else note.node.setAttribute('style',note.style);});
 }
 if(original.startContainer.isConnected&&original.endContainer.isConnected){selection.removeAllRanges();selection.addRange(original);}
 capturePreviewRange();syncPreviewWithoutReset();updateToolbarState();
};
document.querySelectorAll('[data-preview-block]').forEach(function(b){b.onclick=function(){if(!paper.classList.contains('edit-mode'))return;restorePreviewRange();document.execCommand('formatBlock',false,b.dataset.previewBlock);capturePreviewRange();syncPreviewWithoutReset();updateToolbarState();};});
document.getElementById('previewDividerBtn').onclick=function(){if(!paper.classList.contains('edit-mode'))return;insertPreviewBlock('<hr><p><br></p>');};
document.getElementById('previewImageBtn').onclick=function(){if(!paper.classList.contains('edit-mode'))return;var p=document.getElementById('previewImageInsert'),open=p.hidden;document.getElementById('previewWritingPanel').hidden=true;document.getElementById('previewWritingBtn').setAttribute('aria-expanded','false');document.getElementById('markdownHelpPanel').hidden=true;document.getElementById('markdownHelpBtn').setAttribute('aria-expanded','false');if(open)selectPreviewImage(null);if(!open){closeImageInsert();return;}p.hidden=false;this.setAttribute('aria-expanded','true');document.getElementById('previewImageUrl').focus();};
document.getElementById('previewImageUrl').addEventListener('input',function(){cancelPreviewImageLoad();document.getElementById('previewImageFile').value='';text('previewImageState','');});
document.getElementById('previewImageFile').onchange=function(e){
 var file=e.target.files[0];cancelPreviewImageLoad();if(!file)return;
 if(!/^image\//.test(file.type)){text('previewImageState','이미지 파일만 불러올 수 있습니다.');e.target.value='';return;}
 var reader=new FileReader(),ownerStory=activeStory(),token=previewImageLoadId;previewImageReader=reader;
 document.getElementById('previewImageAdd').disabled=true;text('previewImageState','불러오는 중…');
 function current(){return token===previewImageLoadId&&activeStory()===ownerStory&&!document.getElementById('previewImageInsert').hidden;}
 reader.onload=function(){if(!current())return;previewImageReader=null;pendingPreviewImage=reader.result;document.getElementById('previewImageUrl').value='';document.getElementById('previewImageAdd').disabled=false;text('previewImageState',file.name+' · 준비됨');};
 reader.onerror=function(){if(!current())return;cancelPreviewImageLoad();text('previewImageState','파일을 읽지 못했습니다.');};reader.readAsDataURL(file);
};
 function normalizeImageSource(value){var raw=String(value||'').trim(),source=raw,box,img,match,inside,decoder;if(/<img(?:\s|>)/i.test(raw)){box=document.createElement('div');box.innerHTML=raw;img=box.querySelector('img[src]');if(img)source=img.getAttribute('src')||'';}if(source===raw){match=raw.match(/src\s*=\s*(["'])(.*?)\1/i);if(match)source=match[2];else{match=raw.match(/url\(\s*(["'])(.*?)\1\s*\)/i);if(match)source=match[2];else if(/^url\(/i.test(raw)&&raw.lastIndexOf(')')>3)source=raw.slice(raw.indexOf('(')+1,raw.lastIndexOf(')'));else if(/^!\[[^\]]*\]\(/.test(raw)&&raw.lastIndexOf(')')>raw.indexOf('](')){inside=raw.slice(raw.indexOf('](')+2,raw.lastIndexOf(')')).trim();if(/^<[^>]+>$/.test(inside))inside=inside.slice(1,-1);inside=inside.replace(/\s+["'][^"']*["']\s*$/,'');source=inside;}}}decoder=document.createElement('textarea');decoder.innerHTML=String(source||'');source=decoder.value.trim();if((source[0]==='"'&&source[source.length-1]==='"')||(source[0]==="'"&&source[source.length-1]==="'"))source=source.slice(1,-1).trim();if(/^\/\//.test(source))source='https:'+source;if(/^http:\/\//i.test(source))source='https://'+source.slice(7);return/^(https:\/\/|data:image\/)/i.test(source)?source:'';}
document.getElementById('previewImageAdd').onclick=function(){if(!paper.classList.contains('edit-mode')||this.disabled)return;var entered=document.getElementById('previewImageUrl').value,source=pendingPreviewImage||normalizeImageSource(entered);if(!source){text('previewImageState','이미지 주소 또는 파일을 확인하세요.');return;}var layout=document.getElementById('previewImageLayout').value,exportUrl=/^https:\/\//i.test(source)?source:'',html='<figure class="body-image" data-blank="false" data-layout="'+layout+'" data-width="32" data-zoom="100" data-focus-x="50" data-focus-y="50" data-caption-top-font="body" data-caption-top-bold="false" data-caption-top-italic="false" data-caption-top-size="10" data-caption-bottom-font="body" data-caption-bottom-bold="false" data-caption-bottom-italic="false" data-caption-bottom-size="10" data-line-offset="0" data-line-index="0" data-export-url="'+escapeHtml(exportUrl)+'" contenteditable="false"><figcaption class="caption-top" contenteditable="true"></figcaption><div class="body-image-viewport"><img src="'+escapeHtml(source)+'" alt="" referrerpolicy="no-referrer" loading="eager"></div><figcaption class="caption-bottom" contenteditable="true"></figcaption></figure><p><br></p>',inserted=insertPreviewBlock(html);closeImageInsert();pendingPreviewImage='';document.getElementById('previewImageFile').value='';document.getElementById('previewImageUrl').value='';text('previewImageState','');if(inserted)selectPreviewImage(inserted);};
document.getElementById('previewWritingBtn').onclick=function(){var panel=document.getElementById('previewWritingPanel'),open=panel.hidden;closeImageInsert();document.getElementById('markdownHelpPanel').hidden=true;document.getElementById('markdownHelpBtn').setAttribute('aria-expanded','false');panel.hidden=!open;this.setAttribute('aria-expanded',String(open));};
document.getElementById('markdownHelpBtn').onclick=function(){var panel=document.getElementById('markdownHelpPanel'),open=panel.hidden;closeImageInsert();document.getElementById('previewWritingPanel').hidden=true;document.getElementById('previewWritingBtn').setAttribute('aria-expanded','false');panel.hidden=!open;this.setAttribute('aria-expanded',String(open));};
publicationProof.addEventListener('click',function(e){if(!previewEventInside(e)||!paper.classList.contains('edit-mode'))return;var fig=e.target.closest('.body-image');selectPreviewImage(fig||null);});
function previewImageDropRegion(clientX,clientY){return previewProseRegions().find(function(region){var rect=region.getBoundingClientRect();return clientX>=rect.left&&clientX<=rect.right&&clientY>=rect.top&&clientY<=rect.bottom;})||null;}
function previewBodyDropPoint(clientX,clientY){var region=previewImageDropRegion(clientX,clientY);if(!region)return null;var rect=region.getBoundingClientRect();return Math.max(rect.top+1,Math.min(rect.bottom-1,clientY));}
function resetPreviewImagePointerDrag(){
 var state=pointerDragStart;pointerDragStart=null;pointerDragging=false;draggedPreviewImage=null;
 if(state)try{if(state.fig.hasPointerCapture(state.id))state.fig.releasePointerCapture(state.id);}catch(err){}
 dropGuide.hidden=true;delete dropGuide.dataset.zone;dropGuide.querySelectorAll('span').forEach(function(x){x.classList.remove('active');});
}
publicationProof.addEventListener('pointerdown',function(e){
 if(e.button!==0||!previewEventInside(e))return;var fig=e.target.closest('.body-image');
 if(!fig||!paper.classList.contains('edit-mode')||e.target.closest('figcaption'))return;
 e.preventDefault();var next=fig.nextElementSibling;if(!next||!next.matches('p,blockquote,h2,h3,h4,h5,h6')){next=document.createElement('p');next.dataset.imageCaret='true';next.innerHTML='<br>';fig.after(next);}placePreviewCaret(next,false);selectPreviewImage(fig);
 pointerDragStart={x:e.clientX,y:e.clientY,fig:fig,id:e.pointerId,gripY:e.clientY-fig.getBoundingClientRect().top-(parseFloat(fig.style.paddingTop)||0)};pointerDragging=false;
 try{fig.setPointerCapture(e.pointerId);}catch(err){}
});
publicationProof.addEventListener('pointermove',function(e){
 if(!pointerDragStart||e.pointerId!==pointerDragStart.id)return;
 var dx=e.clientX-pointerDragStart.x,dy=e.clientY-pointerDragStart.y;if(!pointerDragging&&Math.sqrt(dx*dx+dy*dy)<7)return;
 pointerDragging=true;e.preventDefault();draggedPreviewImage=pointerDragStart.fig;
 var region=previewImageDropRegion(e.clientX,e.clientY);dropGuide.hidden=!region;
 if(!region){delete dropGuide.dataset.zone;return;}
 var rect=region.getBoundingClientRect(),ratio=(e.clientX-rect.left)/rect.width,zone=ratio<.33?'left':ratio>.67?'right':'center';dropGuide.dataset.zone=zone;
 dropGuide.querySelectorAll('span').forEach(function(x){x.classList.toggle('active',x.dataset.zone===zone);});
});
publicationProof.addEventListener('pointerup',function(e){
 if(!pointerDragStart||e.pointerId!==pointerDragStart.id)return;
 var state=pointerDragStart,dragging=pointerDragging,region=previewImageDropRegion(e.clientX,e.clientY),zone=dropGuide.dataset.zone;
 resetPreviewImagePointerDrag();
 if(!dragging)return;e.preventDefault();
 if(region&&zone){var scroll=previewScrollSnapshot(),rect=region.getBoundingClientRect();state.fig.dataset.layout=zone;relocateImageAtY(state.fig,Math.max(rect.top,Math.min(rect.bottom,e.clientY-state.gripY)),region);syncPreviewWithoutReset();selectPreviewImage(state.fig);restorePreviewScroll(scroll);}
});
publicationProof.addEventListener('pointercancel',resetPreviewImagePointerDrag);
publicationProof.addEventListener('lostpointercapture',function(){if(pointerDragStart)resetPreviewImagePointerDrag();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pointerDragStart){e.preventDefault();resetPreviewImagePointerDrag();}});
document.getElementById('selectedImageLayout').onchange=function(){if(!selectedPreviewImage)return;var nextLayout=this.value;selectedPreviewImage.dataset.layout=nextLayout;refreshPreviewImages();constrainImageToBottom(selectedPreviewImage);syncPreviewWithoutReset();};
document.querySelectorAll('[data-selected-layout]').forEach(function(button){button.onclick=function(){if(!selectedPreviewImage)return;var nextLayout=button.dataset.selectedLayout;selectedPreviewImage.dataset.layout=nextLayout;document.getElementById('selectedImageLayout').value=nextLayout;refreshPreviewImages();constrainImageToBottom(selectedPreviewImage);syncPreviewWithoutReset();selectPreviewImage(selectedPreviewImage);};});
function bindSelectedImageRange(id,dataKey){var range=document.getElementById(id),number=document.getElementById(id+'Number');function apply(value){if(!selectedPreviewImage)return;var v=clampNumber(value,Number(range.min),Number(range.max),Number(range.value));range.value=v;number.value=v;selectedPreviewImage.dataset[dataKey]=v;paintRange(range);refreshPreviewImages();constrainImageToBottom(selectedPreviewImage);previewToSource();}range.oninput=function(){apply(this.value);};number.oninput=function(){if(this.value!=='')apply(this.value);};number.onblur=function(){number.value=range.value;};}
function syncSelectedImageHeight(fig){
 var height=imageHeight(fig),img=fig.querySelector('img'),automatic=height===0;
 setImageControl('selectedImageHeight',height||clampNumber(img&&img.getBoundingClientRect().height,20,2400,300));
 if(automatic)document.getElementById('selectedImageHeightNumber').value='';
 var button=document.getElementById('selectedImageHeightAuto');button.classList.toggle('is-active',automatic);button.setAttribute('aria-pressed',String(automatic));
}
function setSelectedImageHeight(value){
 if(!selectedPreviewImage)return;
 var height=value===0?0:Math.round(clampNumber(value,20,2400,300));selectedPreviewImage.dataset.height=String(height);
 refreshPreviewImages();constrainImageToBottom(selectedPreviewImage);syncPreviewWithoutReset();syncSelectedImageHeight(selectedPreviewImage);scheduleAnnotationLayout();
}
document.getElementById('selectedImageHeight').oninput=function(){setSelectedImageHeight(Number(this.value));};
document.getElementById('selectedImageHeightNumber').oninput=function(){if(this.value!==''&&Number(this.value)>=20&&Number(this.value)<=2400)setSelectedImageHeight(Number(this.value));};
document.getElementById('selectedImageHeightNumber').onchange=function(){setSelectedImageHeight(this.value===''||Number(this.value)===0?0:Number(this.value));};
document.getElementById('selectedImageHeightAuto').onclick=function(){setSelectedImageHeight(0);};
bindSelectedImageRange('selectedImageWidth','width');bindSelectedImageRange('selectedImageZoom','zoom');bindSelectedImageRange('selectedImageFocusX','focusX');bindSelectedImageRange('selectedImageFocusY','focusY');
function blankParagraph(node){return !!(node&&node.tagName==='P'&&!node.textContent.trim()&&!node.querySelector('img,figure,hr,table,[data-annotation-id]'));}
function normalizeImageFlows(root){
 if(!root)return;
 var selection=window.getSelection(),saved=selection.rangeCount&&root.contains(selection.anchorNode)?{start:selection.anchorNode,startOffset:selection.anchorOffset,end:selection.focusNode,endOffset:selection.focusOffset}:null;
 previewProseRegions(root).forEach(function(region){
  var previous=null,separatedByImage=false;
  Array.prototype.slice.call(region.children).forEach(function(block){
   if(block.dataset.imageCaret==='true'){if(blankParagraph(block))return;delete block.dataset.imageCaret;}
   if(block.matches('.body-image,.editor-image-block')){separatedByImage=true;return;}
   var id=block.dataset.imageFlowId;
   delete block.dataset.imageContinuation;delete block.dataset.imageFlowContinues;
   if(id&&previous&&previous.dataset.imageFlowId===id){
    if(!separatedByImage){while(previous.nextElementSibling&&previous.nextElementSibling!==block)previous.nextElementSibling.remove();while(block.firstChild)previous.appendChild(block.firstChild);block.remove();return;}
    previous.dataset.imageFlowContinues='true';block.dataset.imageContinuation='true';
   }
   previous=id?block:null;separatedByImage=false;
  });
  region.querySelectorAll('[data-image-flow-id]').forEach(function(block){if(block.dataset.imageContinuation!=='true'&&block.dataset.imageFlowContinues!=='true')delete block.dataset.imageFlowId;});
 });
 if(saved&&saved.start.isConnected&&saved.end.isConnected){try{selection.setBaseAndExtent(saved.start,saved.startOffset,saved.end,saved.endOffset);}catch(e){}}
}
function unwrapFlowLines(block){block.querySelectorAll('[data-image-flow-line]').forEach(function(line){line.replaceWith.apply(line,Array.prototype.slice.call(line.childNodes));});}
function mergeImageFlowAround(fig){
 var next,prev,same;
 while((next=fig.nextElementSibling)&&next.dataset.imageContinuation==='true'){
  prev=fig.previousElementSibling;same=prev&&prev.dataset.imageFlowId&&prev.dataset.imageFlowId===next.dataset.imageFlowId;
  if(same){
   unwrapFlowLines(prev);unwrapFlowLines(next);while(next.firstChild)prev.appendChild(next.firstChild);
   if(next.dataset.imageFlowContinues==='true')prev.dataset.imageFlowContinues='true';else delete prev.dataset.imageFlowContinues;
   if(prev.dataset.imageContinuation!=='true'&&prev.dataset.imageFlowContinues!=='true')delete prev.dataset.imageFlowId;
   next.remove();
  }else{unwrapFlowLines(next);fig.parentNode.insertBefore(next,fig);}
 }
}
function imageTextBlock(node){return !!(node&&/^(P|BLOCKQUOTE)$/.test(node.tagName));}
function imageFlowId(block){return block.dataset.imageFlowId||('flow-'+Date.now()+'-'+Math.random().toString(36).slice(2,7));}
function imageTextLines(block){
 var walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),lines=[],node,range=document.createRange(),rect,last;
 while((node=walker.nextNode())){
  if(node.parentElement.closest('[data-annotation-marker],.body-annotation-marker'))continue;
  for(var i=0;i<node.data.length;){
   var size=node.data.codePointAt(i)>65535?2:1;range.setStart(node,i);range.setEnd(node,i+size);rect=range.getBoundingClientRect();
   if(rect.height&&rect.width){last=lines[lines.length-1];if(!last||Math.abs(last.top-rect.top)>5)lines.push({node:node,offset:i,top:rect.top,height:rect.height});}
   i+=size;
  }
 }
 return lines;
}
function safeImageTextBoundary(block,boundary,afterAnchor){
 if(!boundary)return null;
 var node=boundary.node,element=node.nodeType===1?node:node.parentElement,anchor=element.closest('[data-annotation-id]');
 if(anchor&&block.contains(anchor))return{node:anchor.parentNode,offset:Array.prototype.indexOf.call(anchor.parentNode.childNodes,anchor)+(afterAnchor?1:0)};
 return boundary;
}
// Split at a text boundary, retaining one logical paragraph and its inline markup.
function insertImageIntoText(fig,block,boundary){
 unwrapFlowLines(block);
 var before=document.createRange(),after=document.createRange();before.selectNodeContents(block);before.setEnd(boundary.node,boundary.offset);after.selectNodeContents(block);after.setStart(boundary.node,boundary.offset);
 if(!before.toString().trim()){block.before(fig);return;}
 if(!after.toString().trim()){block.after(fig);return;}
 var id=imageFlowId(block),continuation=block.cloneNode(false);continuation.removeAttribute('id');
 continuation.appendChild(after.extractContents());continuation.dataset.imageFlowId=id;continuation.dataset.imageContinuation='true';
 block.dataset.imageFlowId=id;block.dataset.imageFlowContinues='true';block.after(fig,continuation);
}
function relocateImageAtY(fig,clientY,region){
 var oldTop=previewBody.getBoundingClientRect().top;
 mergeImageFlowAround(fig);fig.remove();
 clientY+=previewBody.getBoundingClientRect().top-oldTop;
 var candidates=(region?Array.prototype.slice.call(region.children):previewFlowBlocks()).filter(function(el){return !blankParagraph(el);}),targetY=clientY-imageBaseMargin(resolvedLayout(fig)),target=candidates.find(function(el){return targetY<el.getBoundingClientRect().bottom;});
 if(target&&imageTextBlock(target)){
  unwrapFlowLines(target);var lines=imageTextLines(target),line=lines.reduce(function(best,item){var y=item.top-(imageLinePixels()-item.height)/2;return !best||Math.abs(y-targetY)<Math.abs(best.top-(imageLinePixels()-best.height)/2-targetY)?item:best;},null),boundary=safeImageTextBoundary(target,line,false);
  if(boundary)insertImageIntoText(fig,target,boundary);else target.before(fig);
 }else if(target){var rect=target.getBoundingClientRect();if(targetY<rect.top+rect.height/2)target.before(fig);else target.after(fig);}
 else{var regions=previewProseRegions();(region||regions[regions.length-1]||previewBody).appendChild(fig);}
 fig.dataset.lineOffset='0';fig.dataset.lineIndex='0';
}
function previousTextBlock(fig){var node=fig.previousElementSibling;while(node&&blankParagraph(node))node=node.previousElementSibling;return imageTextBlock(node)?node:null;}
function moveAnchorUpOneLine(fig){
 var block=previousTextBlock(fig);if(!block)return false;unwrapFlowLines(block);
 var lines=imageTextLines(block),boundary=safeImageTextBoundary(block,lines[lines.length-1],false);if(!boundary)return false;
 var continued=block.dataset.imageContinuation==='true',id=imageFlowId(block),range=document.createRange();range.selectNodeContents(block);range.setStart(boundary.node,boundary.offset);
 var fragment=range.extractContents(),next=fig.nextElementSibling;
 if(next&&next.dataset.imageContinuation==='true'&&next.dataset.imageFlowId===id){unwrapFlowLines(next);next.insertBefore(fragment,next.firstChild);}
 else{next=block.cloneNode(false);next.removeAttribute('id');delete next.dataset.imageFlowContinues;next.dataset.imageContinuation='true';next.dataset.imageFlowId=id;next.appendChild(fragment);fig.after(next);}
 block.dataset.imageFlowId=id;block.dataset.imageFlowContinues='true';
 if(!block.textContent.trim()){block.remove();if(!continued){delete next.dataset.imageContinuation;if(next.dataset.imageFlowContinues!=='true')delete next.dataset.imageFlowId;}}
 return true;
}
function moveAnchorDownOneLine(fig){
 var block=fig.nextElementSibling;while(block&&blankParagraph(block))block=block.nextElementSibling;
 if(!imageTextBlock(block))return false;unwrapFlowLines(block);
 // Measure the full-width text before introducing its new image anchor.
 var display=fig.style.display;fig.style.display='none';var lines=imageTextLines(block);fig.style.display=display;
 if(!lines.length)return false;
 var boundary=lines.length>1?safeImageTextBoundary(block,lines[1],true):{node:block,offset:block.childNodes.length},id=imageFlowId(block),range=document.createRange();range.selectNodeContents(block);range.setEnd(boundary.node,boundary.offset);
 var fragment=range.extractContents(),prev=fig.previousElementSibling;
 if(prev&&prev.dataset.imageFlowId===id&&prev.dataset.imageFlowContinues==='true'){unwrapFlowLines(prev);prev.appendChild(fragment);}
 else{prev=block.cloneNode(false);prev.removeAttribute('id');delete prev.dataset.imageContinuation;prev.dataset.imageFlowContinues='true';prev.dataset.imageFlowId=id;prev.appendChild(fragment);fig.before(prev);}
 block.dataset.imageFlowId=id;block.dataset.imageContinuation='true';
 if(!block.textContent.trim()){if(block.dataset.imageFlowContinues!=='true')delete prev.dataset.imageFlowContinues;block.remove();if(prev.dataset.imageContinuation!=='true'&&prev.dataset.imageFlowContinues!=='true')delete prev.dataset.imageFlowId;}
 return true;
}
function imageNaturalBottomLimit(fig){var layout=resolvedLayout(fig),floating=layout==='left'||layout==='right',shift=imageLineOffset(fig)*imageLinePixels(),region=previewRegionForNode(fig),bodyRect=(region||previewBody).getBoundingClientRect(),figRect=fig.getBoundingClientRect(),visibleHeight=Math.max(0,figRect.height-(floating&&shift>0?shift:0)),baseTop=figRect.top-bodyRect.top-(floating?0:shift),display=fig.style.display,naturalBottom;fig.style.display='none';naturalBottom=Array.prototype.slice.call((region||previewBody).children).filter(function(el){return el!==fig&&!el.classList.contains('body-image');}).reduce(function(max,el){return Math.max(max,el.getBoundingClientRect().bottom-bodyRect.top);},0);fig.style.display=display;return Math.max(0,Math.floor((naturalBottom-baseTop-visibleHeight)/imageLinePixels()));}
function constrainImageToBottom(fig){var max=imageNaturalBottomLimit(fig),offset=imageLineOffset(fig);if(offset>max){fig.dataset.lineOffset=String(max);var index=Number(fig.dataset.lineIndex);fig.dataset.lineIndex=String(Number.isFinite(index)?index-(offset-max):max);applyImageLineOffset(fig);}return max;}
function moveSelectedImage(direction){
 if(!selectedPreviewImage)return;
 var fig=selectedPreviewImage,index=Number.isFinite(Number(fig.dataset.lineIndex))?Number(fig.dataset.lineIndex):imageLineOffset(fig),offset=imageLineOffset(fig),scroll=previewScrollSnapshot();
 if(offset>0){fig.dataset.lineOffset='0';applyImageLineOffset(fig);for(var i=0;i<offset;i++)if(!moveAnchorDownOneLine(fig))break;}
 var moved=direction<0?moveAnchorUpOneLine(fig):moveAnchorDownOneLine(fig);
 if(!moved&&offset===0)return;
 fig.dataset.lineOffset='0';fig.dataset.lineIndex=String(index+(moved?direction:0));
 refreshPreviewImages();previewToSource();selectPreviewImage(fig);restorePreviewScroll(scroll);
}
document.getElementById('selectedImageMoveUp').onclick=function(){moveSelectedImage(-1);};
document.getElementById('selectedImageMoveDown').onclick=function(){moveSelectedImage(1);};
document.getElementById('selectedImageExportUrl').oninput=function(){if(!selectedPreviewImage)return;selectedPreviewImage.dataset.exportUrl=this.value.trim();previewToSource();};
function finishCaptionChange(fig){applyCaptionStyle(fig,false);constrainImageToBottom(fig);applyImageLineOffset(fig);document.getElementById('selectedImageLineValue').textContent=(fig.dataset.lineIndex||'0')+'줄';previewToSource();}
['Top','Bottom'].forEach(function(where){document.getElementById('selectedImageCaption'+where).oninput=function(){if(!selectedPreviewImage)return;var cls=where==='Top'?'.caption-top':'.caption-bottom',cap=selectedPreviewImage.querySelector(cls);if(!cap){cap=document.createElement('figcaption');cap.className=cls.slice(1);if(where==='Top')selectedPreviewImage.insertBefore(cap,selectedPreviewImage.querySelector('.body-image-viewport'));else selectedPreviewImage.appendChild(cap);}cap.textContent=this.value;finishCaptionChange(selectedPreviewImage);};document.getElementById('selectedImageCaption'+where+'Font').onchange=function(){if(!selectedPreviewImage)return;selectedPreviewImage.dataset['caption'+where+'Font']=this.value;this.style.fontFamily=bodyFontFamily(this.value==='body'?draft.bodyFont:this.value);finishCaptionChange(selectedPreviewImage);};var sizeInput=document.getElementById('selectedImageCaption'+where+'Size');sizeInput.oninput=function(){if(!selectedPreviewImage||this.value==='')return;var size=Number(this.value);if(!Number.isFinite(size)||size<7||size>24)return;selectedPreviewImage.dataset['caption'+where+'Size']=String(size);applyCaptionStyle(selectedPreviewImage,false);};sizeInput.onchange=function(){if(!selectedPreviewImage)return;var current=clampNumber(captionSetting(selectedPreviewImage,where,'Size',10),7,24,10),size=this.value===''?current:clampNumber(this.value,7,24,current);this.value=size;selectedPreviewImage.dataset['caption'+where+'Size']=String(size);finishCaptionChange(selectedPreviewImage);};[['Bold','Bold'],['Italic','Italic']].forEach(function(pair){document.getElementById('selectedImageCaption'+where+pair[0]).onclick=function(){if(!selectedPreviewImage)return;var key='caption'+where+pair[1],active=captionSetting(selectedPreviewImage,where,pair[1],'false')!=='true';selectedPreviewImage.dataset[key]=String(active);this.classList.toggle('is-active',active);this.setAttribute('aria-pressed',String(active));finishCaptionChange(selectedPreviewImage);};});});
function deletePreviewImage(fig){
 if(!fig||!previewBody.contains(fig))return;
 var region=previewRegionForNode(fig),scroll=previewScrollSnapshot();resetPreviewImagePointerDrag();
 mergeImageFlowAround(fig);var next=fig.nextElementSibling,previous=fig.previousElementSibling;
 fig.remove();selectPreviewImage(null);syncPreviewWithoutReset();
 if(next&&next.isConnected&&next.matches('p,blockquote,h2,h3,h4,h5,h6'))placePreviewCaret(next,false);
 else if(previous&&previous.isConnected&&previous.matches('p,blockquote,h2,h3,h4,h5,h6'))placePreviewCaret(previous,true);
 else placePreviewCaret(region,true);
 restorePreviewScroll(scroll);
}
document.getElementById('selectedImageDelete').onclick=function(){deletePreviewImage(selectedPreviewImage);};
publicationProof.addEventListener('keydown',function(e){
 if(previewEventInside(e)&&/^(Arrow|Home|End)/.test(e.key))selectPreviewImage(null);
 if(!previewEventInside(e)||!paper.classList.contains('edit-mode')||! /^(Delete|Backspace)$/.test(e.key)||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.target.closest('figcaption'))return;
 var fig=selectedPreviewImage,selection=window.getSelection();
 if(!fig&&selection.rangeCount&&selection.isCollapsed){
  var range=selection.getRangeAt(0),region=previewRegionForNode(range.startContainer),node=range.startContainer,back=e.key==='Backspace';
  if(node===region){var adjacent=region.childNodes[range.startOffset-(back?1:0)];if(adjacent&&adjacent.nodeType===1&&adjacent.matches('.body-image'))fig=adjacent;}
  else{var block=(node.nodeType===1?node:node.parentElement).closest('p,blockquote,h2,h3,h4,h5,h6');
   if(block&&block.parentNode===region){var edge=range.cloneRange();edge.selectNodeContents(block);if(back)edge.setEnd(range.startContainer,range.startOffset);else edge.setStart(range.startContainer,range.startOffset);
    if(!edge.toString()&&!edge.cloneContents().querySelector('img,[data-annotation-id]')){var sibling=back?block.previousElementSibling:block.nextElementSibling;if(sibling&&sibling.matches('.body-image'))fig=sibling;}
   }
  }
 }
 if(fig&&previewBody.contains(fig)){e.preventDefault();deletePreviewImage(fig);}
});
publicationProof.addEventListener('dragstart',function(e){if(e.target.closest('.body-image'))e.preventDefault();});
var renderPreviewBase=render;render=function(){var editing=paper.classList.contains('edit-mode'),scroll=previewScrollSnapshot();if(selectedPreviewImage){selectedPreviewImage.classList.remove('selected');selectedPreviewImage=null;if(imageTools)imageTools.hidden=true;}renderPreviewBase();paper=publicationProof;previewBody=document.getElementById('publicationEditBody');applyPreviewEditableHosts(editing);if(editing){paper.classList.add('edit-mode');formatTools.dataset.editDisabled='false';ensurePreviewParagraph();}refreshPreviewImages();restorePreviewScroll(scroll);};refreshPreviewImages();
function paintRange(range){if(!range)return;var min=Number(range.min)||0,max=Number(range.max)||100,value=Number(range.value),pct=max===min?0:(value-min)/(max-min)*100;range.style.setProperty('--range-progress',Math.max(0,Math.min(100,pct))+'%');}
function syncRangeControls(){document.querySelectorAll('input[type="range"]').forEach(function(range){paintRange(range);var number=document.querySelector('[data-range-value="'+range.id+'"]');if(number&&document.activeElement!==number)number.value=range.value;});}
function normalizeHex(value){var v=String(value||'').trim();if(/^[0-9a-f]{6}$/i.test(v))v='#'+v;if(/^#[0-9a-f]{3}$/i.test(v))v='#'+v.slice(1).split('').map(function(x){return x+x;}).join('');return/^#[0-9a-f]{6}$/i.test(v)?v.toUpperCase():'';}
document.querySelectorAll('[data-color-text]').forEach(function(input){input.addEventListener('input',function(){var value=normalizeHex(input.value);input.classList.toggle('invalid',input.value.length>0&&!value);if(!value)return;settingOwner(input.dataset.colorText)[input.dataset.colorText]=value;var picker=document.getElementById(input.dataset.colorText);if(picker)picker.value=value;applyColorPreview(input.dataset.colorText,value);scheduleColorRender();});input.addEventListener('blur',function(){var value=normalizeHex(input.value);input.classList.remove('invalid');input.value=value||String(settingOwner(input.dataset.colorText)[input.dataset.colorText]||'').toUpperCase();});});
document.querySelectorAll('[data-range-value]').forEach(function(number){number.addEventListener('input',function(){if(number.value==='')return;var range=document.getElementById(number.dataset.rangeValue),value=Math.max(Number(range.min),Math.min(Number(range.max),Number(number.value)));range.value=value;settingOwner(range.dataset.field)[range.dataset.field]=value;paintRange(range);render();});number.addEventListener('blur',function(){number.value=document.getElementById(number.dataset.rangeValue).value;});});
function replaceAutoText(node){var value=node.data,rx=/(?:^|\n)\s*[<>]\s*[^\n]+|\[[^\]\n]+\]\(https:\/\/[^)\s]+\)|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_|‘[^’\n]+’|'[^'\n]+'/g,match,last=0,frag=document.createDocumentFragment(),changed=false;while((match=rx.exec(value))){changed=true;if(match.index>last)frag.appendChild(document.createTextNode(value.slice(last,match.index)));var token=match[0],el,lineThought=/(?:^|\n)\s*[<>]\s*/.test(token);if(lineThought&&token.charAt(0)==='\n')frag.appendChild(document.createTextNode('\n'));if(/^\*\*/.test(token)||/^__/.test(token)){el=document.createElement('strong');el.textContent=token.slice(2,-2);}else if(/^~~/.test(token)){el=document.createElement('s');el.textContent=token.slice(2,-2);}else if(/^`/.test(token)){el=document.createElement('code');el.textContent=token.slice(1,-1);}else if(/^\[/.test(token)){var link=token.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);el=document.createElement('a');el.textContent=link[1];el.href=link[2];el.target='_blank';el.rel='noopener noreferrer';}else if((/^\*/.test(token)&&/\*$/.test(token))||(/^_/.test(token)&&/_$/.test(token))){el=document.createElement('em');el.textContent=token.slice(1,-1);}else{el=document.createElement('span');el.className='auto-thought';el.dataset.autoStyle='true';if(lineThought)el.dataset.autoLinePrefix=(token.match(/[<>]/)||['<'])[0];el.textContent=lineThought?token.replace(/^(?:\n)?\s*[<>]\s*/,''):token;}frag.appendChild(el);last=match.index+token.length;}if(!changed)return;if(last<value.length)frag.appendChild(document.createTextNode(value.slice(last)));node.replaceWith(frag);}
function decorateMarkdownBlocks(box){Array.prototype.slice.call(box.children).forEach(function(el){if(el.tagName!=='P')return;var source=String(el.textContent||'').trim(),heading=source.match(/^(#{1,6})\s+(.+)$/),list=source.match(/^([-+*]|\d+\.)\s+(.+)$/);if(/^(---|\*\*\*|___)$/.test(source)){el.replaceWith(document.createElement('hr'));return;}if(heading){var level=Math.min(6,heading[1].length+1),h=document.createElement('h'+level);h.textContent=heading[2];h.dataset.markdown='heading';if(centeredBodyBlock(el)){h.style.textAlign='center';h.style.textIndent='0';}el.replaceWith(h);return;}if(list){el.textContent=(/\d/.test(list[1])?list[1]:'•')+' '+list[2];el.classList.add('md-list-item');}});}
function decorateQuotedDialogue(box){
 var walker=document.createTreeWalker(box,NodeFilter.SHOW_TEXT),nodes=[],value='',node;
 while((node=walker.nextNode())){
  var parent=node.parentElement;
  if(!parent||parent.closest('figure,.image-block-controls,code,.auto-thought,[data-annotation-marker],[data-annotation-inline-note]'))continue;
  nodes.push({node:node,start:value.length});value+=node.data;
 }
 var ranges=[],opening=null;
 for(var i=0;i<value.length;i++){
  var character=value[i];if(character!=='"'&&character!=='“'&&character!=='”')continue;
  var escapes=0;for(var back=i-1;back>=0&&value[back]==='\\';back--)escapes++;
  if(escapes%2)continue;
  if(!opening){if(character!=='”')opening={start:i,end:character==='“'?'”':'"'};}
  else if(character===opening.end){ranges.push({start:opening.start,end:i+1});opening=null;}
 }
 var cursor=0;
 nodes.forEach(function(entry){
  var text=entry.node.data,start=entry.start,end=start+text.length,parts=[],last=0;
  while(cursor<ranges.length&&ranges[cursor].end<=start)cursor++;
  for(var index=cursor;index<ranges.length&&ranges[index].start<end;index++){
   var range=ranges[index],from=Math.max(0,range.start-start),to=Math.min(text.length,range.end-start);
   if(from>last)parts.push(document.createTextNode(text.slice(last,from)));
   var span=document.createElement('span');span.className='auto-dialogue';span.dataset.autoStyle='true';span.textContent=text.slice(from,to);parts.push(span);last=to;
  }
  if(!parts.length)return;
  if(last<text.length)parts.push(document.createTextNode(text.slice(last)));
  var fragment=document.createDocumentFragment();parts.forEach(function(part){fragment.appendChild(part);});entry.node.replaceWith(fragment);
 });
}
function decorateAutoStyles(box,forOutput){decorateMarkdownBlocks(box);box.querySelectorAll('p,blockquote').forEach(function(el){var trimmed=String(el.textContent||'').trim(),prefix=trimmed.match(/^([<>])\s*/);if(prefix){var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),node;while((node=walker.nextNode())){if(node.data.trim()){node.data=node.data.replace(/^\s*[<>]\s*/, '');break;}}el.dataset.autoPrefix=prefix[1];el.classList.add('auto-thought');}if(el.tagName==='BLOCKQUOTE')el.classList.add(el.classList.contains('thought')?'auto-thought':'auto-dialogue');});decorateQuotedDialogue(box);var walker=document.createTreeWalker(box,NodeFilter.SHOW_TEXT),nodes=[],node;while((node=walker.nextNode())){var parent=node.parentElement;if(!parent||parent.closest('figure,.image-block-controls,strong,em,s,code,a,[data-auto-style],[data-annotation-id],[data-annotation-marker]'))continue;nodes.push(node);}nodes.forEach(replaceAutoText);box.querySelectorAll('.auto-dialogue').forEach(function(el){el.style.color=draft.dialogueColor;el.style.fontWeight=draft.dialogueBold?'700':el.closest('strong,b')?'inherit':'400';if(!centeredBodyBlock(el))el.style.textAlign='inherit';if(el.tagName==='BLOCKQUOTE'){el.style.border='0';el.style.padding='0';el.style.margin='0 0 '+draft.paragraphGap+'px';}});box.querySelectorAll('.auto-thought').forEach(function(el){el.style.color=draft.thoughtColor;el.style.fontStyle=draft.thoughtItalic?'italic':'normal';if(!centeredBodyBlock(el))el.style.textAlign='inherit';if(el.tagName==='BLOCKQUOTE'||el.dataset.autoPrefix){el.style.border='0';el.style.padding='0';el.style.margin='0 0 '+draft.paragraphGap+'px';}});box.querySelectorAll('span.auto-thought').forEach(function(el){el.style.paddingRight=draft.thoughtItalic?'.08em':'0';});box.querySelectorAll('em').forEach(function(el){el.style.paddingRight='.08em';});if(forOutput)box.querySelectorAll('strong,em').forEach(function(el){el.style.color=draft.emphasisColor;});}
function restoreAutoSource(box){box.querySelectorAll('[data-auto-prefix]').forEach(function(el){el.insertBefore(document.createTextNode(el.dataset.autoPrefix+' '),el.firstChild);el.removeAttribute('data-auto-prefix');});box.querySelectorAll('[data-auto-line-prefix]').forEach(function(el){el.parentNode.insertBefore(document.createTextNode(el.dataset.autoLinePrefix+' '),el);el.removeAttribute('data-auto-line-prefix');});box.querySelectorAll('[data-auto-style]').forEach(function(el){el.replaceWith.apply(el,Array.prototype.slice.call(el.childNodes));});box.querySelectorAll('.auto-dialogue,.auto-thought').forEach(function(el){el.classList.remove('auto-dialogue','auto-thought');});}
function normalizePlainDivs(box,forOutput){Array.prototype.slice.call(box.children).forEach(function(el){if(el.tagName!=='DIV'||el.classList.contains('image-block-controls'))return;var p=document.createElement('p'),centered=centeredBodyBlock(el);p.innerHTML=el.innerHTML;if(centered)p.style.textAlign='center';if(el.className)p.className=el.className;Array.prototype.slice.call(el.attributes).forEach(function(a){if(a.name.indexOf('data-')===0)p.setAttribute(a.name,a.value);});el.replaceWith(p);if(forOutput){var font=bodyFontFamily(draft.bodyFont);p.style.cssText='margin:0 0 '+(p.dataset.imageFlowContinues==='true'?0:draft.paragraphGap)+'px;font-family:'+font+';font-size:'+draft.bodySize+'px;line-height:'+draft.lineHeight+';letter-spacing:'+draft.letterSpacing+'px;text-indent:'+activeIndent()+'px;color:'+draft.textColor+';text-align:justify;word-break:keep-all;';if(centered){p.style.textAlign='center';p.style.textIndent='0';}}});}
var cleanBodyFloatBase=cleanBody;cleanBody=function(forOutput){var box=document.createElement('div');box.innerHTML=cleanBodyFloatBase(forOutput);normalizePlainDivs(box,forOutput);if(forOutput){box.querySelectorAll('.body-image.layout-left,.body-image.layout-right').forEach(function(fig){fig.style.clear='none';});box.querySelectorAll('[data-image-flow-continues="true"]').forEach(function(el){el.style.marginBottom='0';});box.querySelectorAll('[data-image-continuation="true"]').forEach(function(el){el.style.textIndent='0';el.style.width='auto';el.style.maxWidth='none';el.style.overflow='visible';});box.querySelectorAll('[data-image-flow-line="true"]').forEach(function(el){el.style.display='inline';});}decorateAutoStyles(box,forOutput);return box.innerHTML;};
var cleanBodyExpansionBase=cleanBody;cleanBody=function(forOutput){var box=document.createElement('div');box.innerHTML=cleanBodyExpansionBase(forOutput);if(forOutput){box.querySelectorAll('.body-image.layout-left,.body-image.layout-right').forEach(function(fig){var next=fig.nextElementSibling;if(next&&/^(P|BLOCKQUOTE)$/.test(next.tagName)){next.style.width='auto';next.style.maxWidth='none';next.style.overflow='visible';}});box.querySelectorAll('code').forEach(function(el){el.style.cssText+='padding:.08em .3em;background:rgba(70,65,58,.08);font-family:ui-monospace,monospace;font-size:.9em;';});box.querySelectorAll('a').forEach(function(el){el.style.cssText+='color:inherit;text-decoration:underline;text-underline-offset:.18em;';});box.querySelectorAll('.md-list-item').forEach(function(el){el.style.paddingLeft='1.35em';el.style.textIndent='0';});}return box.innerHTML;};
function hasRealImagePrefix(el){var fig=el.previousElementSibling,prefix=fig&&fig.previousElementSibling;return el.dataset.imageContinuation==='true'&&fig&&fig.classList.contains('body-image')&&prefix&&prefix.dataset.imageFlowContinues==='true'&&prefix.dataset.imageFlowId&&prefix.dataset.imageFlowId===el.dataset.imageFlowId;}
function arcaIndentSpacer(width){var span=document.createElement('span');span.style.cssText='display:inline-block;width:'+width+'px;font-size:0;line-height:0;';span.innerHTML='&nbsp;';return span;}
function httpsCssUrlsOnly(value){var safe=true,found=false;String(value).replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi,function(match,doubleQuoted,singleQuoted,unquoted){found=true;var url=doubleQuoted!==undefined?doubleQuoted:singleQuoted!==undefined?singleQuoted:unquoted;if(!/^https:\/\//i.test(String(url).trim())||/\\/.test(url))safe=false;return match;});return found&&safe;}
function makeArcaFragmentSafeBox(box,allowLocalImages){
 var removeTags='style,script,link,iframe,object,embed,audio,svg,math,template,noscript,source',unwrapTags='form,input,textarea,select,button,picture,mark,small,big,kbd,samp,var,tt,dl,dt,dd,abbr,cite,dfn,q,data,bdi,bdo,wbr',blockedProps=['position','z-index','overflow','gap','transform','transform-origin','opacity','filter','backdrop-filter','clip-path','mask','mix-blend-mode','background-blend-mode','isolation','outline','outline-offset','writing-mode','pointer-events','user-select','resize','content','animation','animation-name','transition','shape-outside','cursor'];
 var comments=[],walker=document.createTreeWalker(box,NodeFilter.SHOW_COMMENT),comment;while((comment=walker.nextNode()))comments.push(comment);comments.forEach(function(node){node.remove();});
 box.querySelectorAll(removeTags).forEach(function(el){el.remove();});
 box.querySelectorAll(unwrapTags).forEach(function(el){el.replaceWith.apply(el,Array.prototype.slice.call(el.childNodes));});
  box.querySelectorAll('*').forEach(function(el){
   Array.prototype.slice.call(el.attributes).forEach(function(attr){if(/^on/i.test(attr.name)||attr.name==='class'||attr.name==='contenteditable'||attr.name.indexOf('data-')===0)el.removeAttribute(attr.name);});
   blockedProps.forEach(function(prop){el.style.removeProperty(prop);});
   for(var i=el.style.length-1;i>=0;i--){var prop=el.style[i],value=el.style.getPropertyValue(prop);if(prop.indexOf('-webkit-')===0||(/url\s*\(/i.test(value)&&!httpsCssUrlsOnly(value))||/conic-gradient\s*\(/i.test(value)||(prop==='display'&&/^(?:inline-)?(?:flex|grid)$/i.test(String(value).trim())))el.style.removeProperty(prop);}
  if(el.tagName==='IMG'&&!/^https:\/\//i.test(el.getAttribute('src')||'')&&!(allowLocalImages&&/^data:image\//i.test(el.getAttribute('src')||'')))el.remove();
  if(el.tagName==='A'&&!/^https:\/\//i.test(el.getAttribute('href')||''))el.replaceWith.apply(el,Array.prototype.slice.call(el.childNodes));
 });
 return box;
}
function makeArcaFragmentSafeHtml(html,allowLocalImages){var box=document.createElement('div');box.innerHTML=String(html||'');makeArcaFragmentSafeBox(box,allowLocalImages);return box.innerHTML;}
function isolateArcaBodyClear(block){
 // A full-width table isolates clear:both from floats placed in the side margin.
 // Keep vertical margins outside it so adjoining paragraph spacing still collapses.
 var scope=document.createElement('div');
 scope.style.cssText='display:table;table-layout:fixed;width:100%;margin:'+(block.style.marginTop||'0')+' 0 '+(block.style.marginBottom||'0')+';';
 block.style.marginTop='0';block.style.marginBottom='0';
 block.before(scope);scope.appendChild(block);
}
function arcaCroppedBodyImage(fig,img,src){
 // The supplied Arca save round-trip retains cover backgrounds but removes
 // object-fit/object-position from images, leaving a distorted fixed-height IMG.
 var crop=document.createElement('div'),view=imageView(fig),safeSrc=src.replace(/[\\'"\r\n\f]/g,function(char){return'%'+char.charCodeAt(0).toString(16).toUpperCase().padStart(2,'0');});
 crop.style.cssText='display:table;box-sizing:border-box;width:100%;height:'+imageHeight(fig)+'px;margin:0;padding:0;border:0;font-size:0;line-height:0;text-indent:0;background-size:cover;background-position:'+view.focusX+'% '+view.focusY+'%;background-repeat:no-repeat;';
 crop.style.backgroundImage='url("'+safeSrc+'")';
 crop.setAttribute('role','img');crop.setAttribute('aria-label',img.getAttribute('alt')||'본문 이미지');
 crop.innerHTML='&nbsp;';return crop;
}
function makeArcaBodySafe(box,allowLocalImages){var indent=activeIndent(),blocked=['position','z-index','overflow','gap','transform','transform-origin','opacity','filter','backdrop-filter','clip-path','mask','-webkit-mask','mix-blend-mode','background-blend-mode','isolation','outline','outline-offset','writing-mode','pointer-events','user-select','resize','content','animation','transition','shape-outside'];
 box.querySelectorAll('style,script,link,iframe,object,embed,form,input,textarea,select,button').forEach(function(el){if(el.tagName==='STYLE'||el.tagName==='SCRIPT'||el.tagName==='LINK')el.remove();else el.replaceWith.apply(el,Array.prototype.slice.call(el.childNodes));});
 box.querySelectorAll('p').forEach(function(p){var continuation=p.dataset.imageContinuation==='true',centered=centeredBodyBlock(p),div=document.createElement('div');div.innerHTML=p.innerHTML;div.style.cssText='margin:0 0 '+(p.dataset.imageFlowContinues==='true'?0:draft.paragraphGap)+'px;font-family:'+bodyFontFamily(draft.bodyFont)+';font-size:'+draft.bodySize+'px;line-height:'+draft.lineHeight+';letter-spacing:'+draft.letterSpacing+'px;color:'+draft.textColor+';text-align:justify;';if(centered)div.style.textAlign='center';if(indent>0&&!continuation&&!centered)div.insertBefore(arcaIndentSpacer(indent),div.firstChild);p.replaceWith(div);});
 box.querySelectorAll('blockquote').forEach(function(q){var div=document.createElement('div');div.innerHTML=q.innerHTML;div.style.cssText='margin:0 0 '+(q.dataset.imageFlowContinues==='true'?0:draft.paragraphGap)+'px;color:'+(q.classList.contains('auto-thought')?draft.thoughtColor:draft.dialogueColor)+';font-style:'+(q.classList.contains('auto-thought')&&draft.thoughtItalic?'italic':'normal')+';font-weight:'+(q.classList.contains('auto-dialogue')&&draft.dialogueBold?'700':'400')+';line-height:'+draft.lineHeight+';';if(centeredBodyBlock(q))div.style.textAlign='center';q.replaceWith(div);});
 box.querySelectorAll('code').forEach(function(code){var span=document.createElement('span');span.innerHTML=code.innerHTML;span.style.cssText='display:inline-block;padding:1px 4px;background:rgba(70,65,58,.08);font-family:Consolas,Monaco,"Courier New",monospace;font-size:.9em;';code.replaceWith(span);});
 box.querySelectorAll('figure.body-image').forEach(function(fig){
  var layout=resolvedLayout(fig),width=clampNumber(fig.dataset.width,20,100,45),gutter=Math.max(0,Math.min(4,100-width)),floating=layout==='left'||layout==='right',wrapper=document.createElement('div'),img=fig.querySelector('img'),src=img?normalizeImageSource(img.getAttribute('src')||''):'',top=fig.querySelector('.caption-top'),bottom=fig.querySelector('.caption-bottom'),topMargin=parseFloat(fig.style.marginTop);
  if(!Number.isFinite(topMargin))topMargin=imageBaseMargin(layout);
  if(fig.dataset.blank==='true'){fig.remove();return;}
   if(layout==='left')wrapper.style.cssText='float:left;width:'+width+'%;margin:'+topMargin+'px '+gutter+'% 18px 0;';
   else if(layout==='right')wrapper.style.cssText='float:right;width:'+width+'%;margin:'+topMargin+'px 0 18px '+gutter+'%;';
  else if(layout==='full')wrapper.style.cssText='clear:both;width:'+(fig.style.width||'100%')+';max-width:none;margin:'+topMargin+'px '+(fig.style.marginRight||'0')+' 28px '+(fig.style.marginLeft||'0')+';';
  else wrapper.style.cssText='clear:both;width:'+width+'%;margin:'+topMargin+'px auto 28px;';
  function addCaption(cap,isTop){if(!cap||!cap.textContent.trim())return;var c=document.createElement('div');c.innerHTML=cap.innerHTML;c.style.cssText=cap.style.cssText||((isTop?'margin:0 0 8px;':'margin:8px 0 0;')+'font-size:10px;line-height:1.6;text-align:center;');wrapper.appendChild(c);}
  addCaption(top,true);
  if(/^https:\/\//i.test(src)||(allowLocalImages&&/^data:image\//i.test(src))){if(imageHeight(fig)&&/^https:\/\//i.test(src))wrapper.appendChild(arcaCroppedBodyImage(fig,img,src));else{var cleanImg=document.createElement('img');cleanImg.src=src;cleanImg.alt=img.getAttribute('alt')||'';cleanImg.referrerPolicy='no-referrer';cleanImg.style.cssText=imageSizeCss(fig)+'margin:0;border:0;';wrapper.appendChild(cleanImg);}}
  addCaption(bottom,false);
  if(!wrapper.childNodes.length)wrapper.innerHTML='&nbsp;';
  if(floating){var anchor=document.createElement('div');anchor.style.cssText='display:table;table-layout:fixed;width:100%;height:0;font-size:0;line-height:0;';anchor.innerHTML='&nbsp;';fig.parentNode.insertBefore(anchor,fig);}
  fig.replaceWith(wrapper);if(!floating)isolateArcaBodyClear(wrapper);
 });
 box.querySelectorAll('h2,h3,h4,h5,h6,hr').forEach(function(block){if(block.style.clear==='both')isolateArcaBodyClear(block);});
 box.querySelectorAll('*').forEach(function(el){Array.prototype.slice.call(el.attributes).forEach(function(attr){if(/^on/i.test(attr.name)||attr.name==='class'||attr.name==='contenteditable'||attr.name.indexOf('data-')===0)el.removeAttribute(attr.name);});blocked.forEach(function(prop){el.style.removeProperty(prop);});for(var i=el.style.length-1;i>=0;i--){var prop=el.style[i],value=el.style.getPropertyValue(prop);if(/url\s*\(/i.test(value)&&!(prop==='background-image'&&httpsCssUrlsOnly(value)))el.style.removeProperty(prop);}if(el.tagName==='IMG'&&!/^https:\/\//i.test(el.getAttribute('src')||'')&&!(allowLocalImages&&/^data:image\//i.test(el.getAttribute('src')||'')))el.remove();if(el.tagName==='A'&&!/^https:\/\//i.test(el.getAttribute('href')||'')){el.replaceWith.apply(el,Array.prototype.slice.call(el.childNodes));}});makeArcaFragmentSafeBox(box,allowLocalImages);return box;}
var cleanBodyArcaBase=cleanBody;cleanBody=function(forOutput,allowLocalImages,preserveEditorStructure){var box=document.createElement('div');box.innerHTML=cleanBodyArcaBase(forOutput);if(forOutput&&!allowLocalImages)box.querySelectorAll('[data-image-caret]').forEach(function(node){if(blankParagraph(node))node.remove();else node.removeAttribute('data-image-caret');});if(forOutput&&!preserveEditorStructure)makeArcaBodySafe(box,allowLocalImages);return box.innerHTML;};
var renderToolbarBase=render;render=function(){renderToolbarBase();var size=document.getElementById('toolbarBodySize'),indent=document.getElementById('toolbarIndentSize'),ts=titleFontSpec(settingOwner('titleFont').titleFont),bf=bodyFontFamily(draft.bodyFont);if(document.activeElement!==size)size.value=draft.bodySize;if(document.activeElement!==indent)indent.value=draft.textIndent;document.querySelectorAll('[data-field="titleFont"]').forEach(function(select){if(document.activeElement!==select)select.value=safeTitleFontKey(settingOwner('titleFont').titleFont);select.style.fontFamily=ts.family;select.style.fontStyle=ts.style;Array.prototype.forEach.call(select.options,function(option){var font=titleFontSpec(option.value);option.style.fontFamily=font.family;option.style.fontStyle=font.style;});});document.querySelectorAll('[data-field="bodyFont"]').forEach(function(select){if(document.activeElement!==select)select.value=safeBodyFontKey(draft.bodyFont);select.style.fontFamily=bf;Array.prototype.forEach.call(select.options,function(option){option.style.fontFamily=bodyFontFamily(option.value);});});document.querySelectorAll('#selectedImageCaptionTopFont,#selectedImageCaptionBottomFont').forEach(function(select){var selected=select.value==='body'?draft.bodyFont:select.value;select.style.fontFamily=bodyFontFamily(selected);Array.prototype.forEach.call(select.options,function(option){option.style.fontFamily=bodyFontFamily(option.value==='body'?draft.bodyFont:option.value);});});};
var renderRailPositionBase=render;render=function(){renderRailPositionBase();refreshRailPositionMode();};
document.getElementById('toolbarBodySize').oninput=function(){if(this.value==='')return;storyCollection.common.bodySize=clampNumber(this.value,10,28,14);applyCommonSettings(storyCollection);document.querySelectorAll('[data-field="bodySize"]').forEach(function(x){x.value=draft.bodySize;});render();};
document.getElementById('toolbarIndentSize').oninput=function(){if(this.value==='')return;storyCollection.common.textIndent=clampNumber(this.value,0,80,0);storyCollection.common.indentEnabled=Number(storyCollection.common.textIndent)>0;applyCommonSettings(storyCollection);document.querySelectorAll('[data-field="textIndent"]').forEach(function(x){x.value=draft.textIndent;});render();};

/* Anchored body annotations. Canonical body HTML only keeps the anchor span;
   numbers, rail notes, drag handles, and inline fallbacks are derived views. */
var annotationInsert=document.getElementById('previewAnnotationInsert'),annotationTools=document.getElementById('previewAnnotationTools'),selectedAnnotationId='',annotationDrag=null,annotationMeasureFrame=0;
function annotationById(id){return(Array.isArray(draft.annotations)?draft.annotations:[]).find(function(item){return item.id===id;})||null;}
function annotationFontFamily(item){var key=item&&item.font==='body'?draft.bodyFont:item&&item.font;return bodyFontFamily(key||draft.bodyFont);}
function annotationNumber(value){return String(value).padStart(2,'0');}
function annotationAnchorElements(root){return Array.prototype.slice.call((root||editor).querySelectorAll('.body-annotation-anchor[data-annotation-id]'));}
function annotationElement(root,selector,id){return Array.prototype.slice.call((root||document).querySelectorAll(selector)).find(function(el){return el.dataset.annotationId===id||el.dataset.noteId===id||el.dataset.railSectionId===id;})||null;}
function annotationOrderEntries(root){var seen={},entries=[];annotationAnchorElements(root||editor).forEach(function(anchor){var id=anchor.dataset.annotationId,item=annotationById(id);if(!item||seen[id])return;seen[id]=true;entries.push({id:id,item:item,anchor:anchor,number:entries.length+1});});return entries;}
function pruneAnnotationUi(scope){if(!scope||!scope.querySelectorAll)return;scope.querySelectorAll('[data-annotation-marker]').forEach(function(marker){var anchor=marker.previousElementSibling;if(!anchor||!anchor.classList.contains('body-annotation-anchor')||!annotationById(anchor.dataset.annotationId))marker.remove();});scope.querySelectorAll('[data-annotation-inline-note][data-note-id],.publication-annotation-note[data-note-id]').forEach(function(note){if(!annotationById(note.dataset.noteId))note.remove();});}
function pruneOrphanAnnotations(root){var scope=root||editor,live={},changed=false;annotationAnchorElements(scope).forEach(function(anchor){var id=anchor.dataset.annotationId,text=String(anchor.textContent||'').replace(/\u200B/g,'').trim();if(!id||!text||!annotationById(id)){anchor.remove();changed=true;return;}live[id]=true;});var before=draft.annotations.length;draft.annotations=draft.annotations.filter(function(item){return!!live[item.id];});if(draft.annotations.length!==before)changed=true;if(selectedAnnotationId&&!live[selectedAnnotationId])selectedAnnotationId='';pruneAnnotationUi(scope);if(typeof publicationProof!=='undefined'&&publicationProof&&publicationProof!==scope)pruneAnnotationUi(publicationProof);return changed;}
function syncAnnotationSectionAssignments(){var changed=pruneOrphanAnnotations(editor),sections=orderedRailSections(bodyParagraphCountHtml(editor.innerHTML)),paragraph=0,seen={};annotationAnchorElements(editor).forEach(function(anchor){anchor.className='body-annotation-anchor';});Array.prototype.slice.call(editor.children).forEach(function(block){var isParagraph=paragraphBlockElement(block);if(isParagraph)paragraph++;var index=Math.max(1,paragraph),section=railSectionForParagraph(sections,index);annotationAnchorElements(block).forEach(function(anchor){var id=anchor.dataset.annotationId,item=annotationById(id),next=section?section.id:'';if(!item||seen[id])return;seen[id]=true;if(item.sectionId!==next){item.sectionId=next;item.initialY=null;item.mobileInitialY=null;changed=true;}});});return changed;}
function stripDerivedAnnotationUi(root){if(!root)return;root.querySelectorAll('[data-annotation-marker],[data-annotation-inline-note]').forEach(function(el){el.remove();});root.querySelectorAll('.body-annotation-anchor[data-annotation-id]').forEach(function(anchor){anchor.className='body-annotation-anchor';anchor.removeAttribute('style');anchor.removeAttribute('id');anchor.removeAttribute('role');anchor.removeAttribute('tabindex');anchor.removeAttribute('aria-describedby');anchor.removeAttribute('aria-label');anchor.removeAttribute('contenteditable');});}
function buildInlineAnnotationNote(entry,previewMode){var item=entry.item,note=document.createElement('span'),index=document.createElement('span'),copy=document.createElement('span');note.className='annotation-inline-note';note.dataset.annotationInlineNote='true';note.dataset.noteId=item.id;note.setAttribute('role','note');if(previewMode)note.setAttribute('contenteditable','false');index.className='annotation-index';index.textContent=annotationNumber(entry.number);copy.className='annotation-copy';copy.textContent=item.text;note.appendChild(index);note.appendChild(copy);note.style.fontFamily=annotationFontFamily(item);note.style.fontSize=item.size+'px';note.style.lineHeight='1.55';note.style.color=item.color;note.style.fontWeight=item.bold?'700':'400';note.style.fontStyle=item.italic?'italic':'normal';note.style.textAlign='justify';if(!previewMode)note.style.cssText+='display:block;clear:both;margin:7px 0 16px;padding:7px 0 0;border-top:1px solid '+hexRgba(item.color,.34)+';text-indent:0;white-space:pre-wrap;overflow-wrap:anywhere;';return note;}
function buildMarginAnnotationNote(entry,section){var item=entry.item,note=document.createElement('span');
 note.dataset.annotationInlineNote='true';note.dataset.noteId=item.id;note.setAttribute('role','note');
 note.style.cssText=marginFloatStyle(section,14,annotationExportTop(item),true)+'padding:7px 0 0;border-top:1px solid '+hexRgba(item.color,.48)+';'+'font-family:'+annotationFontFamily(item)+';font-size:'+item.size+'px;line-height:1.55;color:'+item.color+';'+'font-weight:'+(item.bold?'700':'400')+';font-style:'+(item.italic?'italic':'normal')+';text-align:left;text-indent:0;';
 note.innerHTML=annotationNoteCopyHtml(entry);
 return note;}
function decorateAnnotationBody(box,previewMode){stripDerivedAnnotationUi(box);var entries=annotationOrderEntries(box),decorateSections=previewMode?[]:orderedRailSections(bodyParagraphCountHtml(editor.innerHTML));entries.forEach(function(entry){var anchor=entry.anchor,item=entry.item,marker=document.createElement('sup');anchor.className='body-annotation-anchor';if(previewMode){anchor.id='annotation-anchor-'+item.id;anchor.setAttribute('aria-describedby','annotation-note-'+item.id);}else anchor.style.cssText='border-bottom:1px dotted '+item.color+';text-decoration:none;';marker.className='annotation-marker';marker.dataset.annotationMarker='true';marker.setAttribute('contenteditable','false');marker.textContent=annotationNumber(entry.number);marker.style.cssText='margin-left:.12em;color:'+item.color+';font:700 .66em/1 Arial,sans-serif;vertical-align:super;letter-spacing:0;';anchor.after(marker);var block=anchor.closest('p,blockquote,h2,h3,h4,h5,h6');if(!item.sectionId){if(block)block.appendChild(buildInlineAnnotationNote(entry,previewMode));}else if(!previewMode&&block){var noteSection=decorateSections.filter(function(candidate){return candidate.id===item.sectionId;})[0];if(noteSection&&anchor.parentNode)anchor.parentNode.insertBefore(buildMarginAnnotationNote(entry,noteSection),anchor);}});return entries;}
var cleanBodyAnnotationBase=cleanBody;cleanBody=function(forOutput,allowLocalImages,preserveEditorStructure){syncAnnotationSectionAssignments();var box=document.createElement('div'),previewMode=!forOutput||(preserveEditorStructure&&!!allowLocalImages);box.innerHTML=cleanBodyAnnotationBase(forOutput,allowLocalImages,preserveEditorStructure);decorateAnnotationBody(box,previewMode);return box.innerHTML;};
function annotationRailEntries(section){if(!section)return[];return annotationOrderEntries(editor).filter(function(entry){return entry.item.sectionId===section.id;});}
function annotationNoteCopyHtml(entry){var item=entry.item;return'<span class="annotation-index" style="display:block;margin:0 0 4px;color:'+item.color+';font:700 8px/1 Arial,sans-serif;letter-spacing:.12em;">'+annotationNumber(entry.number)+'</span><span class="annotation-copy" style="white-space:pre-wrap;overflow-wrap:anywhere;">'+multilineHtml(item.text)+'</span>';}
function annotationPreviewRailHtml(entries,section){if(!entries.length)return'';return'<div class="annotation-rail-layer" data-annotation-note-layer="true" data-annotation-section-id="'+escapeHtml(section.id)+'">'+entries.map(function(entry){var item=entry.item,top=annotationInitial(item)===null?0:clampNumber(annotationInitial(item)+annotationOffset(item),0,RAIL_POSITION_MAX,0),hidden=annotationInitial(item)===null?'visibility:hidden;':'';return'<div id="annotation-note-'+escapeHtml(item.id)+'" class="publication-annotation-note" data-note-id="'+escapeHtml(item.id)+'" role="note" style="top:'+Math.round(top)+'px;'+hidden+'font-family:'+annotationFontFamily(item)+';font-size:'+item.size+'px;color:'+item.color+';font-weight:'+(item.bold?'700':'400')+';font-style:'+(item.italic?'italic':'normal')+';"><button class="annotation-drag-handle" data-annotation-drag="true" type="button" aria-label="주석 '+annotationNumber(entry.number)+' 위치 이동" title="드래그하거나 방향키로 한 줄씩 이동">⋮⋮</button>'+annotationNoteCopyHtml(entry)+'</div>';}).join('')+'</div>';}
var railContentHtmlAnnotationBase=railContentHtml;railContentHtml=function(forOutput,allowLocal,preferRemote,section){var base=railContentHtmlAnnotationBase(forOutput,allowLocal,preferRemote,section),entries=annotationRailEntries(section);if(!entries.length)return base;if(forOutput&&section)return base;if(base==='&nbsp;')base='';return annotationPreviewRailHtml(entries,section)+base;};
function annotationRectForFirstLine(anchor){var rects=anchor&&anchor.getClientRects?anchor.getClientRects():[];return rects&&rects.length?rects[0]:anchor&&anchor.getBoundingClientRect();}
function annotationFreeY(desired,height,occupied,max){var gap=9,candidates=[clampNumber(desired,0,max,0),0,max];occupied.forEach(function(interval){candidates.push(interval.end+gap);candidates.push(interval.start-gap-height);});candidates=candidates.filter(function(y){return Number.isFinite(y)&&y>=0&&y<=max&&!occupied.some(function(interval){return y<interval.end+gap&&y+height>interval.start-gap;});});if(!candidates.length)return clampNumber(desired,0,max,0);candidates.sort(function(a,b){return Math.abs(a-desired)-Math.abs(b-desired)||a-b;});return Math.round(candidates[0]);}
function annotationLayoutMeasurable(){if(!publicationProof||publicationProof.hidden||publicationProof.getBoundingClientRect().width<200)return false;var cell=publicationProof.querySelector('.publication-rail-cell[data-rail-section-id]');return!!(cell&&cell.getBoundingClientRect().height>0);}
function annotationOffsetBounds(item){var note=annotationElement(publicationProof,'.publication-annotation-note[data-note-id]',item.id),cell=note&&note.closest('.publication-rail-cell'),height=note?note.getBoundingClientRect().height:Math.max(1,item.measuredHeight||1),cellHeight=cell?cell.getBoundingClientRect().height:0,max=cellHeight>0?Math.max(0,cellHeight-height):RAIL_POSITION_MAX,initial=annotationInitial(item)===null?0:annotationInitial(item);return{min:-initial,max:Math.max(0,max-initial)};}
function annotationInitial(item){return mobileViewOn?item.mobileInitialY:item.initialY;}
function annotationOffset(item){return mobileViewOn?item.mobileOffsetY:item.offsetY;}
function annotationMeasured(item){return mobileViewOn?item.mobileMeasuredHeight:item.measuredHeight;}
function setAnnotationInitial(item,value){if(mobileViewOn)item.mobileInitialY=value;else item.initialY=value;}
function setAnnotationOffset(item,value){if(mobileViewOn)item.mobileOffsetY=value;else item.offsetY=value;}
function setAnnotationMeasured(item,value){if(mobileViewOn)item.mobileMeasuredHeight=value;else item.measuredHeight=value;}
function setAnnotationFlow(item,value){if(mobileViewOn)item.mobileFlowOffset=value;else item.flowOffset=value;}
function annotationFlow(item){return mobileViewOn?item.mobileFlowOffset:item.flowOffset;}
function syncAnnotationLayout(){return withExpandedPublication(measureAnnotationLayout);}
function measureAnnotationLayout(){if(!publicationProof||!previewBody)return false;if(publicationProof.getBoundingClientRect().width<200)return false;var changed=syncAnnotationSectionAssignments(),entries=annotationOrderEntries(editor),groups={};entries.forEach(function(entry){if(entry.item.sectionId)(groups[entry.item.sectionId]||(groups[entry.item.sectionId]=[])).push(entry);});Object.keys(groups).forEach(function(sectionId){var cell=annotationElement(publicationProof,'.publication-rail-cell[data-rail-section-id]',sectionId),cellRect=cell&&cell.getBoundingClientRect();if(!cell||!cellRect||!cellRect.height||cellRect.width<30)return;var occupied=Array.prototype.slice.call(cell.querySelectorAll('.rail-preview-item[data-rail-id]')).map(function(el){var rect=el.getBoundingClientRect();return{start:Math.max(0,rect.top-cellRect.top),end:Math.max(0,rect.bottom-cellRect.top)};}).filter(function(interval){return interval.end>interval.start;});groups[sectionId].forEach(function(entry){var item=entry.item,note=annotationElement(cell,'.publication-annotation-note[data-note-id]',item.id);if(!note)return;var height=Math.max(1,Math.ceil(note.getBoundingClientRect().height));if(annotationMeasured(item)!==height){setAnnotationMeasured(item,height);changed=true;}if(annotationInitial(item)!==null){var max=Math.max(0,cellRect.height-height),finalY=clampNumber(annotationInitial(item)+annotationOffset(item),0,max,0);occupied.push({start:finalY,end:finalY+height,ownerId:item.id});}});groups[sectionId].forEach(function(entry){var item=entry.item,note=annotationElement(cell,'.publication-annotation-note[data-note-id]',item.id),anchor=annotationElement(publicationProof,'.body-annotation-anchor[data-annotation-id]',item.id);if(!note||!anchor)return;var height=Math.max(1,Math.ceil(note.getBoundingClientRect().height)),max=Math.max(0,cellRect.height-height);var anchorRect=annotationRectForFirstLine(anchor),desired=anchorRect?anchorRect.top-cellRect.top:0;if(annotationInitial(item)===null){setAnnotationInitial(item,annotationFreeY(desired,height,occupied,max));changed=true;}else if(annotationOffset(item)===0){var probe=clampNumber(annotationInitial(item),0,max,0),others=occupied.filter(function(interval){return interval.ownerId!==item.id;});if(others.some(function(interval){return probe<interval.end&&probe+height>interval.start;})){var freed=annotationFreeY(desired,height,others,max);if(freed!==annotationInitial(item)){setAnnotationInitial(item,freed);changed=true;}}}var finalY=clampNumber(annotationInitial(item)+annotationOffset(item),0,max,0),nextOffset=Math.round(finalY-annotationInitial(item));if(nextOffset!==annotationOffset(item)){setAnnotationOffset(item,nextOffset);changed=true;}var anchorLineHeight=parseFloat(getComputedStyle(anchor).lineHeight),anchorHalfLeading=anchorRect&&isFinite(anchorLineHeight)&&anchorRect.height?Math.max(0,(anchorLineHeight-anchorRect.height)/2):0,flow=Math.round(finalY-desired+anchorHalfLeading);if(annotationFlow(item)!==flow){setAnnotationFlow(item,flow);changed=true;}note.style.top=Math.round(finalY)+'px';note.style.visibility='visible';occupied.push({start:finalY,end:finalY+height});});});if(storyContextDepth)return changed;if(changed){save();var output=document.getElementById('htmlOutput');if(output)output.value=makeHtml(false);}refreshRailAnnotationRows();refreshSelectedAnnotationUi();return changed;}
function scheduleAnnotationLayout(){if(annotationMeasureFrame)cancelAnimationFrame(annotationMeasureFrame);annotationMeasureFrame=requestAnimationFrame(function(){annotationMeasureFrame=0;syncAnnotationLayout();});}
function closeAnnotationInsert(){if(!annotationInsert)return;annotationInsert.hidden=true;document.getElementById('previewAnnotationBtn').setAttribute('aria-expanded','false');text('previewAnnotationState','');}
function annotationSelectionInfo(range){range=range&&range.cloneRange?range.cloneRange():null;if(!range||range.collapsed||!String(range.toString()||'').trim())return{valid:false,message:'본문에서 주석을 달 부분을 먼저 선택하세요.'};var start=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement,end=range.endContainer.nodeType===1?range.endContainer:range.endContainer.parentElement;if(!start||!end||!previewBody.contains(start)||!previewBody.contains(end))return{valid:false,message:'본문 안의 문장을 선택하세요.'};var startBlock=start.closest('p,blockquote'),endBlock=end.closest('p,blockquote');if(!startBlock||startBlock!==endBlock||startBlock.closest('[data-rail-container],figure')||startBlock.dataset.imageContinuation==='true')return{valid:false,message:'하나의 본문 문단 안에서 선택하세요.'};if(start.closest('[data-annotation-id]')||end.closest('[data-annotation-id]'))return{valid:false,message:'이미 주석이 연결된 부분과 겹칠 수 없습니다.'};var fragment=range.cloneContents();if(fragment.querySelector&&fragment.querySelector('[data-annotation-id],[data-annotation-marker],figure,[contenteditable="false"]'))return{valid:false,message:'이미 주석이 있거나 이미지와 겹친 선택입니다.'};return{valid:true,range:range,block:startBlock,text:String(range.toString()).trim()};}
function applyAnnotationSelectionState(){if(!publicationProof)return;publicationProof.querySelectorAll('.body-annotation-anchor.is-selected,.publication-annotation-note.is-selected').forEach(function(el){el.classList.remove('is-selected');});if(!selectedAnnotationId)return;var anchor=annotationElement(publicationProof,'.body-annotation-anchor[data-annotation-id]',selectedAnnotationId),note=annotationElement(publicationProof,'.publication-annotation-note[data-note-id]',selectedAnnotationId);if(anchor)anchor.classList.add('is-selected');if(note)note.classList.add('is-selected');}
function refreshSelectedAnnotationUi(){if(!annotationTools)return;var item=annotationById(selectedAnnotationId),entry=annotationOrderEntries(editor).find(function(candidate){return candidate.id===selectedAnnotationId;});if(!item||!entry){selectedAnnotationId='';annotationTools.hidden=true;applyAnnotationSelectionState();return;}annotationTools.hidden=false;var number=document.getElementById('selectedAnnotationNumber'),content=document.getElementById('selectedAnnotationText'),font=document.getElementById('selectedAnnotationFont'),size=document.getElementById('selectedAnnotationSize'),picker=document.getElementById('selectedAnnotationColor'),code=document.getElementById('selectedAnnotationColorText'),offset=document.getElementById('selectedAnnotationOffset'),rail=!!item.sectionId;number.textContent=annotationNumber(entry.number);if(document.activeElement!==content)content.value=item.text;if(document.activeElement!==font)font.value=item.font==='body'?'body':safeBodyFontKey(item.font);font.style.fontFamily=annotationFontFamily(item);Array.prototype.forEach.call(font.options,function(option){option.style.fontFamily=bodyFontFamily(option.value==='body'?draft.bodyFont:option.value);});if(document.activeElement!==size)size.value=item.size;if(document.activeElement!==picker)picker.value=item.color;if(document.activeElement!==code)code.value=item.color;document.getElementById('selectedAnnotationBold').classList.toggle('is-active',item.bold);document.getElementById('selectedAnnotationBold').setAttribute('aria-pressed',String(item.bold));document.getElementById('selectedAnnotationItalic').classList.toggle('is-active',item.italic);document.getElementById('selectedAnnotationItalic').setAttribute('aria-pressed',String(item.italic));offset.textContent=!rail?'본문 아래':annotationInitial(item)===null?'배치 중':annotationOffset(item)===0?'초기':(annotationOffset(item)>0?'+':'')+Math.round(annotationOffset(item))+'px';['selectedAnnotationMoveUp','selectedAnnotationMoveDown'].forEach(function(id){document.getElementById(id).disabled=!rail||annotationInitial(item)===null||!annotationLayoutMeasurable();});document.getElementById('selectedAnnotationReset').disabled=!rail||annotationInitial(item)===null||annotationOffset(item)===0;applyAnnotationSelectionState();}
function selectAnnotation(id){selectedAnnotationId=annotationById(id)?id:'';if(selectedAnnotationId){selectPreviewImage(null);closeImageInsert();}refreshSelectedAnnotationUi();}
function adjustAnnotationOffset(item,delta){if(!item||!item.sectionId||annotationInitial(item)===null)return;if(!annotationLayoutMeasurable())return;var bounds=annotationOffsetBounds(item);setAnnotationOffset(item,Math.round(clampNumber(annotationOffset(item)+delta,bounds.min,bounds.max,annotationOffset(item))));render();}
function updateAnnotationCopies(item){if(!publicationProof||!item)return;Array.prototype.slice.call(publicationProof.querySelectorAll('[data-note-id] .annotation-copy')).forEach(function(copy){var owner=copy.closest('[data-note-id]');if(owner&&owner.dataset.noteId===item.id)copy.textContent=item.text;});scheduleAnnotationLayout();save();var output=document.getElementById('htmlOutput');if(output)output.value=makeHtml(false);}
var selectPreviewImageAnnotationBase=selectPreviewImage;selectPreviewImage=function(fig){if(fig&&selectedAnnotationId){selectedAnnotationId='';annotationTools.hidden=true;applyAnnotationSelectionState();}return selectPreviewImageAnnotationBase(fig);};
var updateToolbarStateAnnotationBase=updateToolbarState;updateToolbarState=function(){updateToolbarStateAnnotationBase();var button=document.getElementById('previewAnnotationBtn'),editing=paper&&paper.classList.contains('edit-mode'),info=editing?annotationSelectionInfo(previewRange):{valid:false};button.disabled=!editing||!info.valid;button.title=info.valid?'선택한 부분에 주석 달기':'본문에서 주석을 달 부분을 선택하세요';};
var setPreviewEditingAnnotationBase=setPreviewEditing;setPreviewEditing=function(on){if(!on){closeAnnotationInsert();selectedAnnotationId='';if(annotationTools)annotationTools.hidden=true;}setPreviewEditingAnnotationBase(on);updateToolbarState();};
document.getElementById('previewAnnotationBtn').onclick=function(){if(this.disabled||!paper.classList.contains('edit-mode'))return;var info=annotationSelectionInfo(previewRange);if(!info.valid){text('previewAnnotationState',info.message);return;}closeImageInsert();selectPreviewImage(null);document.getElementById('previewWritingPanel').hidden=true;document.getElementById('previewWritingBtn').setAttribute('aria-expanded','false');document.getElementById('markdownHelpPanel').hidden=true;document.getElementById('markdownHelpBtn').setAttribute('aria-expanded','false');document.getElementById('previewAnnotationSelection').textContent=info.text;document.getElementById('previewAnnotationText').value='';annotationInsert.hidden=false;this.setAttribute('aria-expanded','true');try{document.getElementById('previewAnnotationText').focus({preventScroll:true});}catch(e){document.getElementById('previewAnnotationText').focus();}};
document.getElementById('previewAnnotationCancel').onclick=closeAnnotationInsert;
document.getElementById('previewAnnotationAdd').onclick=function(){var info=annotationSelectionInfo(previewRange),noteText=document.getElementById('previewAnnotationText').value.trim();if(!info.valid){text('previewAnnotationState',info.message);return;}if(!noteText){text('previewAnnotationState','주석 내용을 입력하세요.');return;}var id=annotationId(),anchor=document.createElement('span'),segment=info.block.closest('[data-body-segment]'),cell=segment&&segment.querySelector('.publication-rail-cell[data-rail-section-id]');anchor.className='body-annotation-anchor';anchor.dataset.annotationId=id;try{info.range.surroundContents(anchor);}catch(err){var selection=window.getSelection();selection.removeAllRanges();selection.addRange(info.range);previewRange=info.range.cloneRange();text('previewAnnotationState','굵게·기울임 등 서로 다른 서식 경계를 가로지르지 않게 다시 선택해 주세요.');return;}var item=normalizeAnnotation({id:id,text:noteText,font:'body',size:10,color:draft.metaColor,bold:false,italic:false,initialY:null,offsetY:0,sectionId:cell?cell.dataset.railSectionId:''});draft.annotations.push(item);selectedAnnotationId=id;previewRange=document.createRange();previewRange.selectNodeContents(anchor);previewRange.collapse(false);closeAnnotationInsert();previewToSource();render();};
['previewImageBtn','previewWritingBtn','markdownHelpBtn'].forEach(function(id){document.getElementById(id).addEventListener('click',function(){closeAnnotationInsert();if(id==='previewImageBtn')selectAnnotation('');},true);});
publicationProof.addEventListener('click',function(e){if(!paper.classList.contains('edit-mode'))return;var note=e.target.closest('.publication-annotation-note[data-note-id]'),anchor=e.target.closest('.body-annotation-anchor[data-annotation-id]');if(note){selectAnnotation(note.dataset.noteId);return;}if(anchor){selectAnnotation(anchor.dataset.annotationId);return;}if(previewEventInside(e)&&!e.target.closest('.body-image'))selectAnnotation('');});
document.getElementById('selectedAnnotationText').oninput=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.text=this.value;updateAnnotationCopies(item);};
document.getElementById('selectedAnnotationFont').onchange=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.font=this.value==='body'?'body':safeBodyFontKey(this.value);render();};
document.getElementById('selectedAnnotationSize').oninput=function(){var item=annotationById(selectedAnnotationId),value=Number(this.value);if(!item||!Number.isFinite(value)||value<7||value>24)return;item.size=value;render();};
document.getElementById('selectedAnnotationSize').onblur=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.size=clampNumber(this.value,7,24,item.size);this.value=item.size;render();};
document.getElementById('selectedAnnotationColor').oninput=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.color=String(this.value).toUpperCase();document.getElementById('selectedAnnotationColorText').value=item.color;render();};
document.getElementById('selectedAnnotationColorText').oninput=function(){var item=annotationById(selectedAnnotationId),value=normalizeHex(this.value);this.classList.toggle('invalid',this.value.length>0&&!value);if(!item||!value)return;item.color=value;document.getElementById('selectedAnnotationColor').value=value;render();};
document.getElementById('selectedAnnotationColorText').onblur=function(){var item=annotationById(selectedAnnotationId);this.classList.remove('invalid');if(item)this.value=item.color;};
document.getElementById('selectedAnnotationBold').onclick=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.bold=!item.bold;render();};
document.getElementById('selectedAnnotationItalic').onclick=function(){var item=annotationById(selectedAnnotationId);if(!item)return;item.italic=!item.italic;render();};
document.getElementById('selectedAnnotationMoveUp').onclick=function(){adjustAnnotationOffset(annotationById(selectedAnnotationId),-imageLinePixels());};
document.getElementById('selectedAnnotationMoveDown').onclick=function(){adjustAnnotationOffset(annotationById(selectedAnnotationId),imageLinePixels());};
document.getElementById('selectedAnnotationReset').onclick=function(){var item=annotationById(selectedAnnotationId);if(!item||annotationInitial(item)===null)return;setAnnotationOffset(item,0);render();};
document.getElementById('selectedAnnotationDelete').onclick=function(){var id=selectedAnnotationId;if(!id)return;stripDerivedAnnotationUi(previewBody);annotationAnchorElements(previewBody).filter(function(anchor){return anchor.dataset.annotationId===id;}).forEach(function(anchor){anchor.replaceWith.apply(anchor,Array.prototype.slice.call(anchor.childNodes));});draft.annotations=draft.annotations.filter(function(item){return item.id!==id;});selectedAnnotationId='';previewToSource();render();};
publicationProof.addEventListener('pointerdown',function(e){var handle=e.target.closest('[data-annotation-drag]'),note=handle&&handle.closest('.publication-annotation-note[data-note-id]'),item=note&&annotationById(note.dataset.noteId);if(!handle||!note||!item||!item.sectionId||annotationInitial(item)===null||(!paper.classList.contains('edit-mode')&&!railPositionEditing&&!mobileViewOn)||e.button!==0||!annotationLayoutMeasurable())return;selectAnnotation(item.id);var scroller=document.querySelector('.preview-area');annotationDrag={item:item,note:note,pointerId:e.pointerId,startY:e.clientY,startScroll:scroller?scroller.scrollTop:0,startOffset:annotationOffset(item),currentOffset:annotationOffset(item),moved:false};note.classList.add('is-dragging');try{handle.setPointerCapture(e.pointerId);}catch(err){}e.preventDefault();e.stopPropagation();});
publicationProof.addEventListener('pointermove',function(e){if(!annotationDrag||e.pointerId!==annotationDrag.pointerId)return;var scroller=document.querySelector('.preview-area'),delta=e.clientY-annotationDrag.startY+(scroller?scroller.scrollTop-annotationDrag.startScroll:0);if(!annotationDrag.moved&&Math.abs(delta)<4)return;annotationDrag.moved=true;var bounds=annotationOffsetBounds(annotationDrag.item),next=Math.round(clampNumber(annotationDrag.startOffset+delta,bounds.min,bounds.max,annotationDrag.startOffset));annotationDrag.currentOffset=next;annotationDrag.note.style.transform='translateY('+(next-annotationDrag.startOffset)+'px)';e.preventDefault();});
function finishAnnotationDrag(commit){if(!annotationDrag)return;var state=annotationDrag;annotationDrag=null;state.note.classList.remove('is-dragging');state.note.style.transform='';if(commit&&state.moved){setAnnotationOffset(state.item,state.currentOffset);render();}else refreshSelectedAnnotationUi();}
publicationProof.addEventListener('pointerup',function(e){if(!annotationDrag||e.pointerId!==annotationDrag.pointerId)return;e.preventDefault();finishAnnotationDrag(true);});
publicationProof.addEventListener('pointercancel',function(e){if(!annotationDrag||e.pointerId!==annotationDrag.pointerId)return;finishAnnotationDrag(false);});
publicationProof.addEventListener('keydown',function(e){var handle=e.target.closest('[data-annotation-drag]');if(!handle||!/^Arrow(Up|Down)$/.test(e.key))return;var note=handle.closest('[data-note-id]'),item=note&&annotationById(note.dataset.noteId);if(!item)return;e.preventDefault();adjustAnnotationOffset(item,(e.key==='ArrowUp'?-1:1)*imageLinePixels()*(e.shiftKey?5:1));});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&annotationDrag)finishAnnotationDrag(false);});
publicationProof.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IMG')scheduleAnnotationLayout();},true);
var copyAnnotationBase=copy;copy=function(button){syncAnnotationLayout();copyAnnotationBase(button);};
document.getElementById('htmlBtn').addEventListener('click',function(){syncAnnotationLayout();},true);
var renderAnnotationBase=render;render=function(){var keep=selectedAnnotationId;renderAnnotationBase();paper=publicationProof;previewBody=document.getElementById('publicationEditBody');selectedAnnotationId=keep&&annotationById(keep)?keep:'';refreshSelectedAnnotationUi();updateToolbarState();syncAnnotationLayout();scheduleAnnotationLayout();};
/* Story collection UI. The active proof retains all existing editing handlers. */
var singleStoryHtml=makeHtml,storyPreviewRoot=document.getElementById('storyPreviewEntries');
var deletedStory=null,collectionMeasureFrame=0,listedStoryId=storyCollection.activeStoryId;
makeHtml=function(forPreview){
 if(forPreview||storyContextDepth||!storyCollection)return singleStoryHtml(forPreview,'story');
 captureActiveStory();
 var output=storyCollection.stories.map(function(story){return withStoryContext(story,null,function(){return singleStoryHtml(false,'story');});}).join('');
 return '<div style="width:960px;max-width:100%;margin:0 auto;background-color:'+storyCollection.cover.paperColor+';">'+(isSingleCoverView()?'':sharedCoverHtml(false))+contentsHeadingHtml()+'<div style="background-color:'+storyCollection.common.paperColor+';">'+output+collectionFooterHtml(false)+'</div></div>';
};
var singleMissingImages=missingPublishImageCount,singleImageView=hasPreviewOnlyImageView;
missingPublishImageCount=function(){captureActiveStory();var coverMissing=sharedCoverLocalImage&&!/^https:\/\//i.test(normalizeImageSource(storyCollection.cover.heroImageUrl))?1:0;return storyCollection.stories.reduce(function(count,story){return count+withStoryContext(story,null,function(){var oldHero=localHero;localHero='';try{return singleMissingImages();}finally{localHero=oldHero;}});},coverMissing);};
hasPreviewOnlyImageView=function(){captureActiveStory();return storyCollection.stories.some(function(story){return withStoryContext(story,null,singleImageView);});};
function storyTitle(story){return String(story.data.storyTitle===undefined?story.data.title||'':story.data.storyTitle).replace(/\s+/g,' ').trim()||'제목 없는 이야기';}
function storyLabel(story,index){return String(index+1).padStart(2,'0')+' · '+storyTitle(story);}
function listedStory(){return storyCollection.stories.find(function(story){return story.id===listedStoryId;})||activeStory();}
function refreshHeadingFontControls(){
 var contentsSelect=document.querySelector('[data-contents-field="font"]'),titleSelect=document.querySelector('[data-field="storyTitleFont"]');
 [[contentsSelect,storyCollection.contents.font,contentsFontSpec],[titleSelect,storyCollection.reading.storyTitleFont,publicationPromptFontSpec]].forEach(function(entry){
  var select=entry[0],font=entry[2](entry[1]);select.style.fontFamily=font.family;select.style.fontStyle=font.style;
  Array.prototype.forEach.call(select.options,function(option){var spec=entry[2](option.value);option.style.fontFamily=spec.family;option.style.fontStyle=spec.style;});
 });
}
function refreshStoryControls(){
 if(!storyReady)return;
 document.querySelectorAll('[data-contents-field]').forEach(function(field){if(document.activeElement===field)return;var value=storyCollection.contents[field.dataset.contentsField];if(field.type==='checkbox')field.checked=value!==false;else field.value=value;});
 refreshHeadingFontControls();
 var stories=storyCollection.stories,selected=listedStory(),list=document.getElementById('storyList');
 // Keep inputs mounted while typing, including Korean IME composition.
 stories.forEach(function(story,index){
  var row=Array.prototype.find.call(list.children,function(node){return node.dataset.storyId===story.id;});
  if(!row){row=document.createElement('div');row.className='story-list-item';row.dataset.storyId=story.id;
   var number=document.createElement('span');number.className='story-number';
   var input=document.createElement('input');input.type='text';input.className='story-list-title';input.dataset.storyTitle=story.id;input.placeholder='이야기 제목';
   row.append(number,input);list.appendChild(row);
  }
  row.classList.toggle('is-selected',story===selected);
  row.children[0].textContent=String(index+1).padStart(2,'0');
  var input=row.children[1];input.setAttribute('aria-label',(index+1)+'번째 이야기 제목');
  if(document.activeElement!==input)input.value=story.data.storyTitle;
  if(list.children[index]!==row)list.insertBefore(row,list.children[index]||null);
 });
 Array.prototype.slice.call(list.children).forEach(function(row){if(!stories.some(function(story){return story.id===row.dataset.storyId;}))row.remove();});
 var index=stories.indexOf(selected);document.getElementById('moveStoryUpBtn').disabled=index===0;document.getElementById('moveStoryDownBtn').disabled=index===stories.length-1;document.getElementById('deleteStoryBtn').disabled=stories.length===1;
 document.getElementById('storySelectionLabel').textContent=String(index+1).padStart(2,'0')+' 이야기 순서·관리';
 document.getElementById('undoStoryDeleteBtn').hidden=!deletedStory;
 document.getElementById('storyModeHelp').textContent=draft.publicationToggle?(isSingleCoverView()?'표지나 읽기 안내를 누르면 본문을 열고 닫을 수 있습니다.':'이야기 제목이나 읽기 안내를 누르면 본문을 열고 닫을 수 있습니다.'):'본문을 항상 펼쳐서 보여줍니다.';
 refreshLayoutStorySelect();
}
function refreshLayoutStorySelect(){
 var select=document.getElementById('layoutStorySelect'),options=storyCollection.stories.map(function(story,index){return '<option value="'+story.id+'">'+escapeHtml(storyLabel(story,index))+'</option>';}).join('');
 if(select.dataset.signature!==options){select.innerHTML=options;select.dataset.signature=options;}
 select.value=storyCollection.activeStoryId;
 select.closest('.layout-story-setting').hidden=!hasStoryContents();
}
function syncStoryFields(){
 fields.forEach(function(field){var value=settingOwner(field.dataset.field)[field.dataset.field];if(field.type==='checkbox')field.checked=!!value;else field.value=value===undefined?'':value;});
 document.querySelectorAll('[data-color-text]').forEach(function(field){field.value=String(settingOwner(field.dataset.colorText)[field.dataset.colorText]||'').toUpperCase();field.classList.remove('invalid');});
 document.querySelectorAll('[data-mobile-width]').forEach(function(button){button.classList.toggle('is-active',Number(button.dataset.mobileWidth)===mobileAnchorWidth());});
 ['heroImageFile','previewImageFile','previewImageUrl'].forEach(function(id){document.getElementById(id).value='';});
 syncRangeControls();applyMobileViewWidth();
}
function finishStoryEditing(){
 clearTimeout(colorRenderTimer);colorRenderTimer=null;
 if(annotationDrag)finishAnnotationDrag(false);
 if(railPreviewDrag){railPreviewDrag=null;clearRailPreviewDrag();}
 if(paper&&paper.classList.contains('edit-mode'))setPreviewEditing(false);
 if(railPositionEditing)setRailPositionEditing(false);
 closeAnnotationInsert();closeImageInsert();selectPreviewImage(null);selectedAnnotationId='';previewRange=null;savedRange=null;
 pendingPreviewImage='';resetPreviewImagePointerDrag();draggedPreviewImage=null;
 syncRailMeasuredHeights();syncAnnotationLayout();captureActiveStory();
}
function selectStory(id,keepScroll){
 var next=storyCollection.stories.find(function(story){return story.id===id;});
 if(!next||next===activeStory())return;
 var scroll=keepScroll?previewScrollSnapshot():null;
 finishStoryEditing();
 storyCollection.activeStoryId=next.id;draft=next.data;editor.innerHTML=draft.bodyHtml;
 var runtime=runtimeForStory(next);localHero=runtime.hero;localRailImages=runtime.railImages;previewPublicationOpen=runtime.open;heroAspectProbeSrc='';
 syncStoryFields();renderRailSectionsEditor();render();
 if(keepScroll){restorePreviewScroll(scroll);return;}
 // Keep the selected story in view without moving focus out of the settings.
 previewScrollRestoreId++;
 var scroller=document.querySelector('.preview-area'),entry=storyEntry(next),toolbar=document.querySelector('.preview-toolbar');
 if(scroller.scrollHeight>scroller.clientHeight&&getComputedStyle(scroller).overflowY!=='visible')scroller.scrollTop+=entry.getBoundingClientRect().top-scroller.getBoundingClientRect().top-toolbar.getBoundingClientRect().height-24;
}
function newBlankStoryData(){
 var next=cloneStoryData(draft);
 ['kicker','issue','quote','author','footer','heroImageUrl','railImageUrl','railTopText','railBottomText','logDate','logModel','logPrompt','logBot','logPersona','logComment'].forEach(function(key){next[key]='';});
 next.title='새 이야기';next.storyTitle='새 이야기';next.bodyHtml='<p><br></p>';next.annotations=[];next.railItems=[];next.railSections=[];next.bodyLayout='full';next.heroAspect=56.25;next.showLogMeta=false;next.showComment=false;
 return next;
}
function addStory(duplicate){
 finishStoryEditing();var original=listedStory(),index=storyCollection.stories.indexOf(original),next={id:newStoryId(),data:duplicate?cloneStoryData(original.data):newBlankStoryData()};
 if(duplicate){next.data.storyTitle=storyTitle(original)+' (복사본)';var runtime=runtimeForStory(original);storyRuntime[next.id]={hero:runtime.hero,railImages:Object.assign({},runtime.railImages),open:null};}
 storyCollection.stories.splice(index+1,0,next);listedStoryId=next.id;applyCommonSettings(storyCollection);render();
 var input=document.querySelector('[data-story-title="'+next.id+'"]');input.focus();input.select();
 text('storyStatus',duplicate?'이야기를 복제했습니다.':'새 이야기를 추가했습니다. 제목을 입력하고 본문을 작성하세요.');
}
function moveStory(delta){
 captureActiveStory();var index=storyCollection.stories.indexOf(listedStory()),target=index+delta;
 if(target<0||target>=storyCollection.stories.length)return;
 storyCollection.stories.splice(target,0,storyCollection.stories.splice(index,1)[0]);render();
 text('storyStatus','이야기 순서를 변경했습니다.');
}
function deleteStory(){
 if(storyCollection.stories.length<2)return;
 finishStoryEditing();var removed=listedStory(),index=storyCollection.stories.indexOf(removed),next=storyCollection.stories[index+1]||storyCollection.stories[index-1];
 if(removed===activeStory())selectStory(next.id,true);
 storyCollection.stories.splice(index,1);listedStoryId=next.id;deletedStory={story:removed,index:index};render();
 text('storyStatus','“'+storyTitle(removed)+'” 삭제됨');
}
function undoStoryDelete(){
 if(!deletedStory)return;var removed=deletedStory;deletedStory=null;
 storyCollection.stories.splice(Math.min(removed.index,storyCollection.stories.length),0,removed.story);listedStoryId=removed.story.id;
 applyCommonSettings(storyCollection);render();text('storyStatus','삭제한 이야기를 복원했습니다.');
}
function storyEntry(story){
 var entry=Array.prototype.find.call(storyPreviewRoot.children,function(node){return node.dataset.storyId===story.id;});
 if(!entry){entry=document.createElement('section');entry.className='story-preview-entry';entry.dataset.storyId=story.id;
  var host=document.createElement('div');host.className='story-preview-host';entry.appendChild(host);storyPreviewRoot.appendChild(entry);
 }return entry;
}
function scopeStoryPreviewIds(host,story){
 host.querySelectorAll('[id]').forEach(function(element){element.id=story.id+'-'+element.id;});
 host.querySelectorAll('[aria-describedby]').forEach(function(element){element.setAttribute('aria-describedby',element.getAttribute('aria-describedby').split(/\s+/).map(function(id){return story.id+'-'+id;}).join(' '));});
 host.querySelectorAll('[contenteditable]').forEach(function(element){element.setAttribute('contenteditable','false');});
 host.querySelectorAll('.annotation-drag-handle').forEach(function(button){button.remove();});
}
function renderStoryCollection(){
 if(!storyReady)return;captureActiveStory();
 var current=activeStory(),activeEntry=storyEntry(current),activeHost=activeEntry.lastElementChild;
 var collectionRoot=document.getElementById('storyPreviewCollection'),coverHost=document.getElementById('sharedCoverPreview'),contentsHost=document.getElementById('contentsHeading');
 collectionRoot.style.backgroundColor=storyCollection.cover.paperColor;
 storyPreviewRoot.style.backgroundColor=storyCollection.common.paperColor;
 collectionRoot.style.width=mobileViewOn?mobileColumnWidth()+'px':'';
 var coverHtml=isSingleCoverView()?'':sharedCoverHtml(true);if(coverHost.innerHTML!==coverHtml)coverHost.innerHTML=coverHtml;
 contentsHost.innerHTML=contentsHeadingHtml(true);document.getElementById('collectionFooter').innerHTML=collectionFooterHtml(true);syncSharedCoverControls();measureSharedCover();
 // Move the live editor before replacing its former story's passive content.
 if(publicationProof.parentNode!==activeHost){activeHost.replaceChildren(publicationProof);delete activeHost.dataset.signature;}
 storyCollection.stories.forEach(function(story,index){
  var entry=storyEntry(story),host=entry.lastElementChild,isActive=story===current;
  entry.classList.toggle('is-active',isActive);
  host.classList.toggle('story-passive-proof',!isActive);host.classList.toggle('publication-proof',!isActive);
  host.style.width=mobileViewOn?mobileColumnWidth()+'px':'';
  if(mobileViewOn)host.style.setProperty('width',mobileColumnWidth()+'px','important');
  if(!isActive){var runtime=runtimeForStory(story),signature=JSON.stringify([hasStoryContents(),isLastStoryData(story.data),story.data,runtime.hero,runtime.railImages,runtime.open,mobileViewOn,mobileAnchorWidth()]);
   if(host.dataset.signature!==signature){host.innerHTML=withStoryContext(story,null,function(){return singleStoryHtml(true,'story');});scopeStoryPreviewIds(host,story);host.dataset.signature=signature;}
  }
  if(storyPreviewRoot.children[index]!==entry)storyPreviewRoot.insertBefore(entry,storyPreviewRoot.children[index]||null);
 });
 Array.prototype.slice.call(storyPreviewRoot.children).forEach(function(entry){if(!storyCollection.stories.some(function(story){return story.id===entry.dataset.storyId;}))entry.remove();});
 refreshStoryControls();measureOtherStories();
}
function measureOtherStories(){
 if(!storyReady||storyContextDepth)return;
 var changed=false;
 storyCollection.stories.forEach(function(story){if(story===activeStory())return;var host=storyEntry(story).lastElementChild;
  withStoryContext(story,host,function(){if(syncRailMeasuredHeights())changed=true;if(syncAnnotationLayout())changed=true;});
 });
 if(changed){save();document.getElementById('htmlOutput').value=makeHtml(false);}
}
function scheduleCollectionMeasurement(){
 if(collectionMeasureFrame)cancelAnimationFrame(collectionMeasureFrame);
 collectionMeasureFrame=requestAnimationFrame(function(){collectionMeasureFrame=0;syncRailMeasuredHeights();syncAnnotationLayout();measureOtherStories();});
}
storyPreviewRoot.addEventListener('load',function(event){if(event.target.tagName==='IMG')scheduleCollectionMeasurement();},true);
storyPreviewRoot.addEventListener('toggle',function(event){
 var entry=event.target.closest('.story-preview-entry');if(!entry||entry.dataset.storyId===storyCollection.activeStoryId||event.target.tagName!=='DETAILS')return;
 var story=storyCollection.stories.find(function(item){return item.id===entry.dataset.storyId;});if(!story)return;
 runtimeForStory(story).open=event.target.open;
},true);
function beginStoryBodyEditing(id,bookmark,keepScroll){
 selectStory(id,keepScroll);listedStoryId=id;
 if(railPositionEditing)setRailPositionEditing(false);
 setPreviewEditing(true);refreshStoryControls();
 var regions=previewProseRegions(),region=regions[bookmark?bookmark.region:0]||regions[0];if(!region)return;
 region.focus({preventScroll:true});
 var range=document.createRange(),node=region;
 if(bookmark&&bookmark.path){
  bookmark.path.forEach(function(index){node=node&&node.childNodes[index];});
  if(node){range.setStart(node,Math.min(bookmark.offset,node.nodeType===3?node.length:node.childNodes.length));range.collapse(true);}
 }
 if(!node||!bookmark){range.selectNodeContents(region);range.collapse(true);}
 var selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);capturePreviewRange();updateToolbarState();
}
storyPreviewRoot.addEventListener('click',function(event){
 if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 var entry=event.target.closest('.story-preview-entry'),body=event.target.closest('.prose');
 if(!entry||!body||event.target.closest('a,button,input,textarea,select,.publication-rail-cell'))return;
 if(entry.dataset.storyId===storyCollection.activeStoryId&&(paper.classList.contains('edit-mode')||railPositionEditing))return;
 var regions=previewProseRegions(body),region=regions.find(function(node){return node.contains(event.target);});if(!region)return;
 var caret=document.caretRangeFromPoint&&document.caretRangeFromPoint(event.clientX,event.clientY),bookmark={region:regions.indexOf(region),path:[],offset:0};
 if(caret&&region.contains(caret.startContainer)){
  bookmark.offset=caret.startOffset;var node=caret.startContainer;
  while(node!==region){bookmark.path.unshift(Array.prototype.indexOf.call(node.parentNode.childNodes,node));node=node.parentNode;}
 }
 event.preventDefault();event.stopPropagation();beginStoryBodyEditing(entry.dataset.storyId,bookmark,true);
},true);
document.getElementById('storyList').addEventListener('focusin',function(event){
 var row=event.target.closest('[data-story-id]');if(!row)return;listedStoryId=row.dataset.storyId;refreshStoryControls();
});
document.getElementById('storyList').addEventListener('input',function(event){
 var input=event.target,id=input.dataset.storyTitle;if(!id)return;
 var story=storyCollection.stories.find(function(item){return item.id===id;});if(!story)return;
 story.data.storyTitle=input.value;render();
});
document.getElementById('layoutStorySelect').addEventListener('change',function(){selectStory(this.value);openPublicationPreview();});
// Keep the saved single-story preference while presenting it as a plain show/hide switch.
document.getElementById('showSingleStoryHeading').addEventListener('input',function(){storyCollection.reading.singleStoryView=this.checked?'contents':'cover';render();});
document.getElementById('addStoryBtn').onclick=function(){addStory(false);};
document.getElementById('duplicateStoryBtn').onclick=function(){addStory(true);};
document.getElementById('deleteStoryBtn').onclick=deleteStory;
document.getElementById('undoStoryDeleteBtn').onclick=undoStoryDelete;
document.getElementById('moveStoryUpBtn').onclick=function(){moveStory(-1);};
document.getElementById('moveStoryDownBtn').onclick=function(){moveStory(1);};
// Opening defaults and prompt presentation apply to every story.
document.addEventListener('input',function(event){var key=event.target.dataset.field;
 if(key==='publicationToggle'||key==='publicationInitialState'){
  storyCollection.stories.forEach(function(story){runtimeForStory(story).open=null;});previewPublicationOpen=null;
 }
},true);
document.addEventListener('click',function(event){var button=event.target.closest('[data-mobile-width]');if(!button)return;var width=clampNumber(button.dataset.mobileWidth,280,560,375);storyCollection.common.mobileAnchorWidth=width;applyCommonSettings(storyCollection);},true);
var replacePanel=document.getElementById('previewReplacePanel'),replaceButton=document.getElementById('previewReplaceBtn');
function closeReplacePanel(){replacePanel.hidden=true;replaceButton.setAttribute('aria-expanded','false');}
replaceButton.onclick=function(){var open=replacePanel.hidden;document.querySelectorAll('.toolbar-popover').forEach(function(panel){panel.hidden=true;});document.querySelectorAll('.preview-format-tools [aria-expanded]').forEach(function(button){button.setAttribute('aria-expanded','false');});replacePanel.hidden=!open;replaceButton.setAttribute('aria-expanded',String(open));if(open)document.getElementById('replaceFrom').focus();};
document.addEventListener('click',function(event){if(!replacePanel.contains(event.target)&&!replaceButton.contains(event.target))closeReplacePanel();});
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!replacePanel.hidden){closeReplacePanel();replaceButton.focus();}});
var singleReplace=document.getElementById('replaceBtn').onclick;
document.getElementById('replaceBtn').onclick=function(){if(paper.classList.contains('edit-mode'))previewToSource();singleReplace();};
var renderSingleStory=render;
render=function(){
 applyCommonSettings(storyCollection);renderSingleStory();renderStoryCollection();
 fields.forEach(function(field){if(document.activeElement===field)return;var owner=settingOwner(field.dataset.field);if(field.type==='checkbox')field.checked=!!owner[field.dataset.field];else field.value=owner[field.dataset.field]===undefined?'':owner[field.dataset.field];});
};
document.querySelectorAll('[data-cover-field]').forEach(function(field){field.addEventListener('input',function(){storyCollection.cover[field.dataset.coverField]=field.type==='checkbox'?field.checked:field.value;render();});});
document.querySelectorAll('[data-contents-field]').forEach(function(field){field.addEventListener('input',function(){var key=field.dataset.contentsField;storyCollection.contents[key]=field.type==='checkbox'?field.checked:key==='align'?contentsAlign(field.value):key==='font'?contentsFontKey(field.value):field.value;render();});});
storyReady=true;refreshStoryControls();
// Story switching and collection layout changes can change the proof width.
// Reuse the existing layout solver when its measured width changes.
if(typeof ResizeObserver!=='undefined'){
 var previousCollectionWidth=0,storyResizeObserver=new ResizeObserver(function(entries){var width=entries[0].contentRect.width;if(Math.abs(width-previousCollectionWidth)>.5){previousCollectionWidth=width;scheduleCollectionMeasurement();}});
 storyResizeObserver.observe(document.getElementById('storyPreviewCollection'));
}

render();
})();
