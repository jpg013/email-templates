const markup = `
<div style="overflow: hidden; height: 60px; background: #EAEAEB; padding: 0 20px; display: flex; align-items: center; justify-content: center;">
  <div style="position: relative; left: -25px; top: -20px">
    <img  src="<%- svgs[0].srcUrl %>" />
  </div>

  <div style="display: flex; align-items: center; justify-content: center; margin-left: auto; line-height: 60px; color: #F5A623; font-size: 16px; padding-left: 10px; font-family: Arial; letter-spacing: .7px">
    <div style="padding-right: 10px; position: relative; top: -1px;">
      <img  src="<%- svgs[0].srcUrl %>" />
    </div>
    <span>
      Sentiment Alert
    </span>
  </div>
</div>

<div style="background: #F4F4F4; padding: 10px 0">
  <div style="font-weight: bold; padding-left: 20px; height: 30px; line-height: 30px; font-family: Arial; letter-spacing: .7px; font-size: 16px; color: #59595a">
    <span>Your <a style="color: #15D399; text-decoration: none !important; color: " href="<%= analysisLink %> "> <%= analysisName %> </a> analysis in the <%= folderName %> folder has had a significant volume change</span>
  </div>

  <div style="padding-left: 20px; height: 30px; line-height: 30px; font-family: Arial; letter-spacing: .7px; font-size: 14px; color: #9F9F9F">
    <span>Streaming time range: Three months from September 9 to December 9 2017, refreshes daily.</span>
  </div>

  <div style="padding-left: 20px; height: 30px; line-height: 30px; font-family: Arial; letter-spacing: .7px; font-size: 14px; color: #9F9F9F">
    <span>Triggered: November 9, 2017 12:25 Hrs</span>
  </div>
</div>

<div style="background: #FFFFFF; padding: 10px 0">
  <div style="font-weight: bold; padding-left: 20px; height: 30px; line-height: 30px; font-family: Arial; letter-spacing: .7px; font-size: 20px; color: #59595a">
    Volume Changes
  </div>
</div>

<div style="padding:0">
  <table style="border: 1px solid #C0C0C0; width: 100%">
    <tr style="height: 90px; width: 100%;">
      <td style="border-right: 1px solid #C0C0C0; width: 50%">
        Volume Increase
        <img  src="<%- svgs[0].srcUrl %>" />
      </td>
      <td style="width: 50%">Mentions</td>
    </tr>
  </table>
</div>
`

module.exports = {
  id: 'volume_change',
  markup,
  svgs: ['alert_warning_icon']
}
