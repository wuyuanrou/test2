// pages/play_song/play_song.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songId: "",
    lyrics: [],
    recommendSongs: [],
    comments: [],
    songName:"",
    //无专辑图默认
    imgUrl: "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
    songUrl: "",
    duration: 0,//单位是毫秒
    //IsPlaying: 'false',
    playingIcon: "../../img/icon_startPlaying_green.png",
    //liked: 'false',
    timeLrc: [],
    //当前播放歌词下标
    index:-1,
    top: 0,
    action:{
      "method": "pause"
    },
    situ:""
  },

  playSitu(){
    if(this.data.action.method=='pause'){
      console.log("play")
      this.setData({
        action: {"method": "play"},
        playingIcon: "../../img/icon_stopPlaying_red.png",
        situ: "play"
      })
    }else{
      console.log("stop")
      this.setData({
        action: {"method": "pause"},
        playingIcon: "../../img/icon_startPlaying_green.png",
        situ: "pause"
      })
    }
  },

  // StopPlaying(){
  //   console.log("stop")
  //   this.setData({
  //     IsPlaying: 'false',
  //     playingIcon: "../../img/icon_startPlaying_green.png",
  //     action: {
  //       "method": "pause"
  //     }
  //   })
  // },

  getSongDetail(songid){
    wx.request({
      url: 'http://121.40.19.111:3000/song/detail',//用localhost会报400，提示网络拥挤
      method: "GET",
      data: {
        ids: songid
      },
      success: (res)=>{
        console.log("songdetail:",res.data)
        this.setData({
          imgUrl: res.data.songs[0].al.picUrl,
          songName: res.data.songs[0].name,
          duration: res.data.songs[0].dt
        })
      }
    })
  },

  getSongUrl(songid){
    var songurl=""
    wx.request({
      url: 'http://121.40.19.111:3000/song/url',
      method: "GET",
      data: {
        id: songid
      },
      success: (res)=>{
        console.log("songurl:",res.data)
        songurl=res.data.data[0].url
        console.log("songUrl:", songurl)
        this.setData({
          songUrl: songurl
        })
      }
    })
  },

  lrcShow(songid){
    wx.request({
      url: 'http://localhost:3000/lyric',
      method: "GET",
      data: {
        id: songid
      },
      success: (res)=>{
        //console.log("lyric:", res.data.lrc.lyric)
        var lyrics=res.data.lrc.lyric
        //处理字符串
        /**
         * 拆分成一句一句存进列表
         * 数据删除（没有歌词的）
         * 时间文本拆分(正则)
         */
        var re=/\[\d{2}:\d{2}\.\d{2,3}\]/
        var lyricslist=lyrics.split("\n")
        var time_lrc=[]
        //console.log(lyricslist)
        for(var i=0;i<lyricslist.length;i++){
          var date=lyricslist[i].match(re)
          if(date!=null){
            var lrc=lyricslist[i].replace(re, "")
            var time=date[0]
            if(time!=null){
              //去掉括号
              var timeStr=time.slice(1, -1)
              //拆开分钟数和秒数
              var splitList=timeStr.split(":")
              //分钟
              var min=splitList[0]
              //秒数
              var sec=splitList[1]
              //转成秒数
              var cal=parseFloat(min)*60+parseFloat(sec)
              time_lrc.push([cal, lrc])
            }
          }
        }
        //console.log(time_lrc)
        this.setData({
          timeLrc: time_lrc
        })
      }
    })
  },  

  //歌词跟踪
  timechange(e){
    //console.log(e)
    var playTime=e.detail.currentTime
    var list=this.data.timeLrc

    for(var i=0;i<list.length;i++){
      if(list[i][0]<=playTime && list[i+1][0]>playTime){
        console.log(list[i][0], list[i][1], playTime, list[i+1][0])
        this.setData({
          index: i,
        })
      }
      var index=this.data.index
      if(index>1){
        this.setData({
          top: (index-1)*50
        })
      }
    }
  },

  finishPlaying(){
    console.log("播放结束")
    this.setData({
      IsPlaying: 'false',
      playingIcon: "../../img/icon_startPlaying_green.png"
    })
  },

  getRecommendSongs(songid){
    wx.request({
      url: 'http://121.40.19.111:3000/simi/song',
      method: "GET",
      data: {
        id: songid
      },
      success: (res)=>{
        console.log("recommendSongs:", res.data),
        this.setData({
          recommendSongs: [...this.data.recommendSongs, ...res.data.songs]
        })
      }
    })
  },

  getComments(songid){
    wx.request({
      url: 'http://121.40.19.111:3000/comment/hot',
      method: "GET",
      data: {
        id: songid,
        type: 0
      },
      success: (res)=>{
        console.log("comments:", res.data),
        this.setData({
          comments: [...this.data.comments, ...res.data.hotComments],
        })
      },
    })
  },

  playSong(e){
    console.log("id:", e.currentTarget.dataset.songid)
    var songId=JSON.stringify(e.currentTarget.dataset.songid)

    wx.navigateTo({
      url: `../../pages/play_song/play_song?id=${songId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //console.log("options:", options)
    var id=JSON.parse(options.id)
    //var id=347230

    this.setData({
      songId: id,
    })
    console.log("id:" ,this.data.songId)

    this.getSongDetail(id)
    this.getSongUrl(id)
    this.lrcShow(id)
    this.getRecommendSongs(id)
    this.getComments(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})