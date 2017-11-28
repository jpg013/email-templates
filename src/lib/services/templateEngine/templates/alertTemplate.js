const markup = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Dunami Volume Change Alert</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>

  <body style="padding: 0; margin: 0">
    <table align="center" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse;">
      <tr bgcolor="#EAEAEB" height="60">
        <td width="430" height="60" style="padding-left: 10px">
          <% if (image_source === 'embedded_base_64') { %>
            <img style="display: block; margin-top: -5px;" height="60" width="135" width: alt="Dunami Logo" src="data:image/png;base64, <%- files[0].base_64_string %>"></img>
          <% } else if (image_source === 'embedded_attachment') { %>
            <img style="display: block; margin-top: -5px;" height="60" width="135" width: alt="Dunami Logo" src="cid:<%- files[0].content_id %>"></img>
          <% } else if (image_source === 'link') { %>
            <img style="display: block; margin-top: -5px;" height="60" width="135" width: alt="Dunami Logo" src="<%- files[0].url_link %>"></img>
          <% } %>
        </td>

        <td width="40" height="60" align="right">
          <% if (image_source === 'embedded_base_64') { %>
            <img style="display: block;" height="26" width="24" src="data:image/png;base64, <%- files[1].base_64_string %>"></img>
          <% } else if (image_source === 'embedded_attachment') { %>
            <img style="display: block;" height="26" width="24" src="cid:<%- files[1].content_id %>"></img>
          <% } else if (image_source === 'link') { %>
            <img style="display: block;" height="26" width="24" width: alt="Alert" src="<%- files[1].url_link %>"></img>
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
          <font size="4" color="#59595a" face="sans-serif" style="font-weight: bolder">
            Your <a style="color: #15D399; text-decoration: none !important; color: " href="<%= analysis_link %> "> <%= analysis_name %> </a> analysis in the <%= folder_name %> folder has had a significant volume change.
          </font>
          <br />
          <br />
          <font size="3" color="#9F9F9F" face="sans-serif" style="font-weight: 300">
            Streaming time range:&nbsp;<%= stream_period %>&nbsp;from <%= formatted_stream_start_date %>&nbsp;to&nbsp;<%= formatted_stream_start_date %>,&nbsp;refreshes&nbsp;<%= stream_frequency %>.
          </font>
        </td>
      </tr>
    </table>

    <table align="center" border="1" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse;">
      <tr bgcolor="#FFF" height="300" valign="top">
        <td width="400">
          <table align="center" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td height="30" style="padding-left: 10px; text-transform: uppercase; font-weight: 300">
                <font size="3" color="#9F9F9F" face="sans-serif">
                  new posts
                </font>
              </td>
            </tr>

            <tr>
              <td height="100">
                <table align="center" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td width="35" align="right">
                      <% if (image_source === 'embedded_base_64') { %>
                        <img style="display: block;" height="18" width="17" src="data:image/png;base64, <%- files[2].base_64_string %>"></img>
                      <% } else if (image_source === 'embedded_attachment'){ %>
                        <img style="display: block;" style="display: block" alt="Plus Icon" height="18" width="17" src="cid:<%- files[2].content_id %>"></img>
                      <% } else if (image_source === 'link') { %>
                        <img style="display: block" alt="Plus Icon" height="18" width="17" src="<%- files[2].url_link %>"></img>
                      <% } %>
                    </td>
                    <td width="365" align="left" style="padding-left: 3px;">
                      <font size="7" color="#59595a" face="sans-serif" style="font-weight: bolder"><%= new_post_count %></font>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-left: 22px; font-weight: 300">
                      <font size="3" color="#9F9F9F" face="sans-serif">
                        since previous alert
                      </font>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>

        <td width="400">
          <table align="center" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td width="400" height="30" style="padding-left: 10px; text-transform: uppercase; font-weight: 300">
                <font size="3" color="#9F9F9F" face="sans-serif">
                  sentiment breakdown
                </font>
              </td>
            </tr>

            <tr>
              <td>
                <table align="center" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td width="400" height="265" align="center">
                      <% if (image_source === 'embedded_base_64') { %>
                        <img style="display: block;" height="18" width="17" src="data:image/png;base64, <%- files[2].base_64_string %>"></img>
                      <% } else if (image_source === 'embedded_attachment'){ %>
                        <img style="display: block;" style="display: block" alt="Plus Icon" height="18" width="17" src="cid:<%- files[2].content_id %>"></img>
                      <% } else if (image_source === 'link') { %>
                        <img style="display: block" alt="Plus Icon" height="212" width="400" src="<%- files[3].url_link %>"></img>
                      <% } %>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

module.exports = {
  id: 'alert_template',
  markup,
  images: [{
    file_id: 'dunami_logo_icon.png',
    content_id: 'dunami_logo_icon',
    url_link: ''
  },
  {
    file_id: 'alert_warning_icon.png',
    content_id: 'alert_warning_icon',
    url_link: ''
  },
  {
    file_id: 'plus_icon.png',
    content_id: 'plus_icon',
    url_link: ''
  }],
  charts: [{
    chartName: 'donut_chart',
    dataProp: 'sentiment',
    opts: {}
  }]
}
