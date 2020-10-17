<template>
    <div class="preview">
        <div class="device">
            <div class="screen">
                <h3>{{content.title || '通知标题'}}</h3>
                <div v-if="content.contextType=='1'">
                    <!--<p>{{data.context}}</p>-->
                    <p><span v-text="content.context"></span></p>
                </div>
                <div v-else>
                    <img :src="content.context" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props:['content'],
    data(){
        return {
        }
    },
    methods:{
        
    },
    mounted(){
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
        width: 232px;
        height: 420px;
        margin: 0 auto;
        background-image: url(../../../assets/notice_image/notice.png);
        background-size: contain;
        background-repeat: no-repeat;
    }
    .screen{
        width: 182px;
        height: 276px;
        position: relative;
        left: 25px;
        top: 52px;
    }
    .screen{
        >h3{
            font-size: 8px;
            color: #000000;
            text-align: center;
            margin: 0;
            line-height: 30px;
        }
        >div{
            height: 248px;
            overflow-y: auto;
            background-color: #fff;
            img{
                width: 100%
            }
            p{
                font-size: 6px;
                color: #000000;
                line-height: 18px;
                max-height: 248px;
                overflow-y: auto;
                word-break:break-all;
                padding: 0 10px;
                margin: 0;
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
