<template>
    <div class="preview">
        <div class="device">
            <div class="screen">
                <div v-if="content.contextType=='1'">
                    <h3>{{content.title}}</h3>
                    <!--<p>{{content.context}}</p>-->
                    <p><span v-html="htmlstr"></span></p>
                    <div>
                        {{content.publishers}}
                        <div>{{content.time[0] | transTime }}</div>
                    </div>
                </div>
                <div v-else>
                    <h3>{{content.title}}</h3>
                    <img :src="content.context" alt="">
                </div>
            </div>
        </div>
        <p>预览效果</p>
    </div>
</template>
<script>
import {transTime} from "@/filters/notice";
export default {
    filters:{transTime},
    props:['content','htmlstr']
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
                height: 110px;
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
