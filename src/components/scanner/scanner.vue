<template>
    <span>
        <el-tooltip class="item" effect="dark" content="提示：请将身份证放在读卡器上，按“读身份证”按键" placement="top">
            <el-button plain type="primary" @click="readCard" :loading="loading">读身份证</el-button>
        </el-tooltip>
        <div id="scanner" style="width: 0px;height: 0px"></div>
    </span>
</template>

<script>
let Scanner;
export default {
    data(){
        return {
            loading:false
        }
    },
    computed:{
        isRJ(){
            if(window.rjIDCardReader){
                return true;
            }else{
                return false;
            }
        }
    },
    methods:{
        readCard: function () {
            this.$emit('start')
            setTimeout(() => {
                const initResult = this.initReadIdCard()
                if (initResult) {
                    this.getIdData()
                }
            }, 100)
        },
        initReadIdCardObj: function () {
            this.loading = true
            let inIE = '<OBJECT id="scannerOBJ" classid="clsid:466151F4-CF5B-407C-B4D1-6FCFCCBD5EE6" width=0% height=0%></OBJECT><br>'
            let noIE = '<OBJECT ID="scannerOBJ" CLSID="{466151F4-CF5B-407C-B4D1-6FCFCCBD5EE6}" TYPE="application/x-itst-activex" width=0% height=0%></OBJECT> <br/>'
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                //IE环境
                document.getElementById('scanner').innerHTML = inIE
                Scanner = document.getElementById('scannerOBJ')
            } else {
                //非IE环境

                if(this.isRJ){
                    Scanner = window.rjIDCardReader
                }else{
                    document.getElementById('scanner').innerHTML = noIE
                    Scanner = document.getElementById('scannerOBJ')
                }
            }
            this.loading = false
        },
        initReadIdCard: function () {

            let checkIdDevice = true
            //初始化插件
            if (Scanner === undefined) {
                checkIdDevice = false
                alert('身份证读取插件初始化失败')
                this.$alert('<span>身份证读取插件初始化失败，请检查使用环境并确认是否已经安装相关插件</span><br><a style="color: #409EFF" href=' + this.GLOBAL.activeX_down_url + ' target="_blank">点击下载插件</a>' +
            '&nbsp;&nbsp;<span style="font-weight: bold">插件只支持IE浏览器(Edge不支持)</span><br>安装完成点击确定或重新打开浏览器可使用身份证读卡器录入', '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定'
                })
                return false
            }
            let initOcx

            try {
                //初始化读卡器
                initOcx = this.isRJ? rjIDCardReader.start(1001): Scanner.Start(1001);
            
            } catch (e) {
                checkIdDevice = false
                this.$alert('<span>身份证读取器初始化失败，请检查使用环境并确认是否已经安装插件</span><br><a style="color: #409EFF" href=' + this.GLOBAL.activeX_down_url + ' target="_blank">点击下载插件</a>' +
            '&nbsp;&nbsp;<span style="font-weight: bold">插件只支持IE浏览器(Edge不支持)</span><br>安装完成点击确定或重新打开浏览器可使用身份证读卡器录入', '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定'
                })
                return false
            }
            if (checkIdDevice) {
                if (!initOcx) {
                    checkIdDevice = false
                    this.$message.error('身份证读卡器连接失败')
                    return false
                }
            }
            return true
        },
        getIdData: function () {

            let toRead;
            // public string Read(bool reverse = true, bool upper = true)
            if(this.isRJ){
                rjIDCardReader.read().then(str=>{
                    toRead = str
                    this.stopReader(toRead)
                })
            }else{
                toRead = Scanner.Read();
                this.stopReader(toRead)
            }

        },
        stopReader: function(toRead) {

            if (!toRead || toRead=='') {
                this.error('读取卡片失败，请检查卡片是否正常')
                
                this.isRJ? rjIDCardReader.stop(): Scanner.Stop();
                this.$parent.idLoading = false
                return
            }
            let data = JSON.parse(toRead)

            this.isRJ? rjIDCardReader.stop(): Scanner.Stop();
            
            data.photo = data.photo? 'data:image/jpeg;base64,'+data.photo : null
            this.$emit('getData',data)
        }
    },
    mounted(){
        this.initReadIdCardObj()
    }
}
</script>

