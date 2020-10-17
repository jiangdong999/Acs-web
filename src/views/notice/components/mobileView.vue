<template>
    <div class="preview">
        <div class="device">
            <div class="screen">
                <div v-if="data.contextType=='1'">
                    <h3>{{data.title}}</h3>
                    <!--<p>{{data.context}}</p>-->
                    <p v-html="data.context"></p>
                    <div>{{data.publishers}}
                        <div>{{data.upTime | transTime }}</div>
                    </div>
                </div>
                <div v-else>
                    <h3>{{data.title}}</h3>
                    <img :src="data.context" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getNotice} from "@/api/notice";
import {transTime} from "@/filters/notice";

export default {
    props:['id'],
    filters:{transTime},
    data(){
        return {
            data:{}
        }
    },
    methods:{
        getData:function(){
            let self = this;
            getNotice({circularId:self.id}).then(function (response) {
                if (response.data && response.data.code === 1) {
                    self.data = response.data.data
                    let html = self.data.context
                    self.data.context = html.replace(/\r|\n/g, '</br>');
                } else {
                    self.$parent.handleClose();
                }
            }).catch(function (a) {
            console.error(a)
            });
        }
    },
    mounted(){
        this.getData()
    }
}
</script>
<style lang="scss" scoped>
    .preview{
        overflow: hidden;
        width: 100%;
    }
    .preview{
        >p{
            font-size: 14px;
            color: #aaaaaa;
            text-align: center;
        }
    }
    .device{
        width: 190px;
        height: 375px;
        margin: 0 auto;
        background-image: url(../../../assets/notice_image/mobile.png);
    }
    .screen{
        width: 160px;
        height: 210px;
        position: relative;
        left: 15px;
        top: 70px;
        padding: 10px 15px;
    }
    .screen{
        >div{
            height: 100%;
            overflow-y: auto;

            img{
                width: 100%
            }
            h3{
                font-size: 8px;
                color: #000000;
                text-align: center;
                margin: 10px 0;
                height: 8px;
                line-height: 8px;
            }
            p{
                font-size: 6px;
                color: #000000;
                line-height: 14px;
                height: 120px;
                overflow-y: auto;
                word-break:break-word;
				white-space: pre-wrap;
            }
            div{
                line-height: 12px;
                font-size: 6px;
                color: #000000;
                text-align: right
            }
        }
    }
</style>
