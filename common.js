var api = {
	"formal": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址 
		"ajUrl": "//socket.wsshanghai.com", //服务器地址 开关
		"siteInfomation": "http://api-head.wsshanghai.com/v5/SiteInfomation-add.htm",
		"appName": "年会"
	},
	"dev": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址
		"ajUrl": "//socket.wsshanghai.com", //服务器地址 开关
		"siteInfomation": "http://api-head.wsshanghai.com/v5/SiteInfomation-add.htm",
		"appName": "年会"
	}
}
var lks = "dev";
export default {
	Interface: {
		"site": lks,
		"wsUrl": api[lks]["wsUrl"],
		"ajUrl": api[lks]["ajUrl"],
		"appName": api[lks]["appName"],
		"siteInfomation": api[lks]["siteInfomation"],
		"addr": {
			"activityCheck": '/activityCheck.htm',
			"activityStart": '/activityStart.htm',
			"activityStop": '/activityStop.htm'
		}
	}
}
