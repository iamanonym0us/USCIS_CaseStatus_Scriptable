// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
const receipt = args.widgetParameter?args.widgetParameter:'YSC21900525'

const url = `https://egov.uscis.gov/casestatus/landing.do`
main()
function notify(content){
  notif = new Notification()
  notif.title = "Status Change"
  notif.body = content
  //notif.schedule()
}
async function main(){
  let result = await run();
  let casestat = result.trim().replace(/\n\s/g,'')
  casestat = casestat.replace('+','')
  if (casestat.match(/.*New Card.*/))
   {notify("Congrats! Case Status changed and New card is being produced")}
   else if(casestat.match(/.*Card Was Mailed.*/)){notify("Congrats! Case Status changed and Your card was mailed to you")}
  let date = new Date()
  let lastupd = date.toLocaleDateString()+" "+date.toLocaleTimeString()
  let widget = new ListWidget();
  let head = widget.addText(receipt)
  head.font= Font.boldRoundedSystemFont(12)
  head.textColor= Color.white()
  head.centerAlignText()
  widget.addSpacer(5)
  let val = widget.addText(casestat+"\n As of "+lastupd);
  val.textColor= Color.white();
  val.centerAlignText()
  val.font=Font.mediumRoundedSystemFont(14)
  widget.useDefaultPadding()
  widget.backgroundColor=Color.black()
  Script.setWidget(widget) 
  Script.complete()
  widget.presentSmall()
  
}

async function run () {
  let webview = new WebView()
  await webview.loadURL(url)
  await webview.evaluateJavaScript(`document.getElementById('receipt_number').value = '${receipt}'`)
  await webview.evaluateJavaScript(`document.getElementsByName("initCaseSearch")[0].click()`)
  await webview.waitForLoad()
//     await webview.present(true)
  let status = await webview.evaluateJavaScript(`document.getElementsByClassName("current-status-sec")[0].innerText`);
// let status = await webview.evaluateJavaScript('document.getElementsByClassName("rows text-center")[0].innerText')
  return status;
}
