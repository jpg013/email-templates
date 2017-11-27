const markup = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Dunami Volume Change Alert</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>

  <body style="padding: 0; margin: 0">
    <table align="center" border="1" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse;">
      <tr bgcolor="#EAEAEB" height="60">
        <td width="430" height="60" style="padding-left: 10px">
          <% if (embedFiles) { %>
            <image style="display: block" height="60" width="135" width: alt="Dunami Logo" src="data:image/png;base64, <%- files[0].base_64_string %>"></image>
          <% } else { %>
            <image style="display: block" height="60" width="135" width: alt="Dunami Logo" src="cid:<%- files[0].content_id %>"></image>
          <% } %>
        </td>

        <td width="40" height="60" align="right">
          <% if (embedFiles) { %>
            <image height="26" width="24" src="data:image/png;base64, <%- files[1].base_64_string %>"></image>
          <% } else { %>
            <image height="26" width="24" src="cid:<%- files[1].content_id %>"></image>
          <% } %>
        </td>

        <td width="330" height="60" style="padding-right: 10px; letter-spacing: .7px" align="right">
          <font size="3" color="#F5A623" face="sans-serif">
            Volume, Sentiment and New Post Alerts
          </font>
        </td>
      </tr>

      <tr bgcolor="#F4F4F4" height="100">
        <td colspan="3" style="padding-left: 10px;">
          <font size="3" color="#59595a" face="sans-serif">
            Your <a style="color: #15D399; text-decoration: none !important; color: " href="<%= analysis_link %> "> <%= analysis_name %> </a> analysis in the <%= folder_name %> folder has had a significant volume change.
          </font>
        </td>
      </tr>
    </table>

    <table align="center" border="1" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse;">
      <tr height="350" bgcolor="#FFF">
        <td width="400" height="100%">
          <table height="100%" width="100%">
            <tr height="30">
              <td style="padding-left: 10px; text-transform: uppercase; font-weight: 300" >
                <font size="3" color="#9F9F9F" face="sans-serif">
                  new posts
                </font>
              </td>
            </tr>

            <tr height="60" bgcolor="pink">

              <td valign="top">
                <% if (embedFiles) { %>
                  <image height="26" width="24" src="data:image/png;base64, <%- files[2].base_64_string %>"></image>
                <% } else { %>
                  <image style="display: block" alt="Plus Icon" height="26" width="24" src="cid:<%- files[2].content_id %>"></image>
                <% } %>
              </td>
            </tr>
          </table>
        </td>

        <td width="400" height="100%">
          <table height="100%" width="100%">
            <tr height="30">
              <td style="padding-left: 10px; text-transform: uppercase; font-weight: 300" >
                <font size="3" color="#9F9F9F" face="sans-serif">
                  Sentiment Breakdown
                </font>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html
`

module.exports = {
  id: 'alert_template',
  markup,
  images: [{
    file_id: 'dunami_logo_icon.png',
    content_id: 'dunami_logo_icon'
  },
  {
    file_id: 'alert_warning_icon.png',
    content_id: 'alert_warning_icon'
  },
  {
    file_id: 'plus_icon.png',
    content_id: 'plus_icon'
  }],
  charts: [{
    id: 'donut_chart',
    content_id: undefined,
    dataProp: 'sentiment'
  }]
}
