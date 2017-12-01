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
          <img style="display: block; margin-top: -5px;" height="60" width="135" width: alt="Dunami Logo" src="<%- images[0].url_src %>"></img>
        </td>

        <td width="40" height="60" align="right">
          <img style="display: block;" height="26" width="24" width: alt="Alert" src="<%- images[1].url_src %>"></img>
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
            Streaming period:&nbsp;<%= stream_period %>&nbsp;Ends&nbsp;<%= formatted_stream_end_date %>,&nbsp;refreshes&nbsp;<%= stream_frequency %>.
          </font>
        </td>
      </tr>
    </table>

    <table align="center" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse; border-left: 1px solid #DEDEDE; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE" height="230">
      <tr bgcolor="#FFF" valign="top">
        <td width="400" style="border-right: 1px solid #DEDEDE;">
          <table align="center" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td height="30" style="padding-left: 10px; text-transform: uppercase; font-weight: 300">
                <font size="3" color="#9F9F9F" face="sans-serif">
                  new posts
                </font>
              </td>
            </tr>

            <tr valign="top">
              <td height="200" style="padding-top: 10px">
                <table align="top" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td width="35" align="right">
                      <img style="display: block" alt="Plus Icon" height="24" width="24" src="<%- images[2].url_src %>"></img>
                    </td>
                    <td width="365" align="left" style="padding-left: 5px; font-size: 76px; letter-spacing: 2.5px; font-weight: 700">
                      <font color="#59595a" face="sans-serif"><%= new_post_count %></font>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-left: 20px; font-weight: 300">
                      <font size="3" color="#9F9F9F" face="sans-serif">
                        since previous alert time period.
                      </font>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>

        <td width="400">
          <table align="center" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td width="400" height="30" style="padding-left: 10px; text-transform: uppercase; font-weight: 300">
                <font size="3" color="#9F9F9F" face="sans-serif">
                  sentiment breakdown
                </font>
              </td>
            </tr>

            <tr height="200" valign="top">
              <td>
                <table align="center" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td width="400" height="200" align="center" style="padding-top: 10px">
                      <% if (image_source === 'base_64_string') { %>
                        <img style="display: block;" height="200" width="370" src="data:image/png;base64, <%- attachments[0].base_64_string %>"></img>
                      <% } else if (image_source === 'attachment'){ %>
                        <img style="display: block;" style="display: block" alt="Plus Icon" height="200" width="370" src="cid:<%- attachments[0].content_id %>"></img>
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

    <table align="center" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse; border-left: 1px solid #DEDEDE; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE" height="320">
      <tr height="30">
        <td height="30" style="padding-left: 10px; text-transform: uppercase; font-weight: 300" bgcolor="green" width="400">
          <font size="3" color="#9F9F9F" face="sans-serif">
            volume trends
          </font>
        </td>
        <td height="30" bgcolor="purple" width="400">
          <span style="display: inline-block; margin-left: 4px; margin-right: 2px; height: 10px; width: 20px; background: #10CF50; border-radius: 10px;"></span>
          <font size="2" color="#9F9F9F" face="sans-serif">
            Positive
          </font>

          <span style="display: inline-block; margin-left: 4px; margin-right: 2px; height: 10px; width: 20px; background: #FF4F2F; border-radius: 10px;"></span>
          <font size="2" color="#9F9F9F" face="sans-serif">
            Negative
          </font>

          <span style="display: inline-block; margin-left: 4px; margin-right: 2px; height: 10px; width: 20px; background: #6B6969; border-radius: 10px;"></span>
          <font size="2" color="#9F9F9F" face="sans-serif">
            Neutral
          </font>

          <span style="display: inline-block; margin-left: 4px; margin-right: 2px; height: 10px; width: 20px; background: #00AFD4; border-radius: 10px;"></span>
          <font size="2" color="#9F9F9F" face="sans-serif">
            Unknown
          </font>
        </td>
      </tr>

      <tr bgcolor="yellow">
        <td height="290" bgcolor="yellow" colspan="2">

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
    url_src: ''
  },
  {
    file_id: 'alert_warning_icon.png',
    content_id: 'alert_warning_icon',
    url_src: ''
  },
  {
    file_id: 'plus_icon.png',
    content_id: 'plus_icon',
    url_src: ''
  }],
  attachments: [{
    attachmentName: 'donut_chart',
    dataProp: 'sentiment',
    opts: {}
  }]
}
