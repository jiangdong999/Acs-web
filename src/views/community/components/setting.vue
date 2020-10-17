<template>
  <el-tabs tab-position="top">
    <el-tab-pane label="读卡设置">
        <el-form ref="form" label-width="150px">
            <el-form-item label="读卡规则一：">
                <el-checkbox-group v-model="recordCardType[0]" :max="1">
                    <el-checkbox label="0">反转字节顺序</el-checkbox>
                    <el-checkbox label="1">仅截取后4字节</el-checkbox>
                    <el-checkbox label="2">前4字节补零</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="读卡规则二：">
                <el-checkbox-group v-model="recordCardType[1]" :max="1">
                    <el-checkbox label="0">反转字节顺序</el-checkbox>
                    <el-checkbox label="1">仅截取后4字节</el-checkbox>
                    <el-checkbox label="2">前4字节补零</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="读卡规则三：">
                <el-checkbox-group v-model="recordCardType[2]" :max="1">
                    <el-checkbox label="0">反转字节顺序</el-checkbox>
                    <el-checkbox label="1">仅截取后4字节</el-checkbox>
                    <el-checkbox label="2">前4字节补零</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <div class="remarks">
                备注：<br/>
                1、转换是先执行规则一，在执行规则二，最后执行规则三；<br/>
                2、每项规则可单选反转字节、截取后4位、补零其中的一个策略，或者置空。
            </div>
            <div class="form-dialog-control-area">
                <el-button type="default" @click="$parent.handleClose()">取消</el-button>
                <el-button type="primary" @click="handleCardSubmit()">确定</el-button>
            </div>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="审批设置">
        <el-form label-width="150px">
            <el-radio-group v-model="authorityForm.authorityCount">
                <el-row>
                    <el-radio :label="-1">默认通过所有申请</el-radio>
                </el-row>
                <el-row>
                    <el-radio :label="1">默认通过家庭里前<el-input v-model="personCount" size="mini"></el-input>位成员的申请，超过人数后需要手工审批</el-radio>
                </el-row>
                <el-row>
                    <el-radio :label="0">所有申请都需要手工审批</el-radio>
                </el-row>
            </el-radio-group>
            <div class="form-dialog-control-area">
                <el-button type="default" @click="$parent.handleClose()">取消</el-button>
                <el-button type="primary" @click="handleAuthoritySubmit()">确定</el-button>
            </div>
        </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
    import {modifySetting,cardSetting} from "@/api/community"

    export default {
        props: {
            data: {
                type: Object,
                default: {}
            }
        },
        data(){
            return {
                personCount:'',
                authorityForm:{
                    authorityCount:null
                },
                recordCardType:[[],[],[]]
            }
        },
        methods:{
            handleAuthoritySubmit:function(formName){
                let self = this
                self.data.authorityCount = self.authorityForm.authorityCount == "1"?self.personCount:self.authorityForm.authorityCount;
               
                modifySetting(self.data).then(function (response) {
                    if (response.data && response.data.code === 1) {
                        self.$message({
                        message: '提交成功',
                        type: 'success'
                        });
                    } else {
                        self.$message({
                        message: '提交成功,但提交内容有误，请检查',
                        type: 'warning'
                        });
                    }
                    self.$parent.$parent.handleClose();
                }).catch(function (a) {
                    console.error(a)
                });
            },
            handleCardSubmit:function(){
                let r = []
                r.push(this.recordCardType[0][0])
                r.push(this.recordCardType[1][0])
                r.push(this.recordCardType[2][0])
                this.data.recordCardType = r.join(",")
                let self = this
                cardSetting(self.data).then(function (response) {
                    if (response.data && response.data.code === 1) {
                        self.$message({
                        message: '提交成功',
                        type: 'success'
                        });
                    } else {
                        self.$message({
                        message: '提交成功,但提交内容有误，请检查',
                        type: 'warning'
                        });
                    }
                    self.$parent.$parent.handleClose();
                }).catch(function (a) {
                    console.error(a)
                });
            }
        },
        mounted(){
            let recordCardType = this.data.recordCardType.split(",")
            recordCardType[0]?this.recordCardType[0].push(recordCardType[0]):false;
            recordCardType[1]?this.recordCardType[1].push(recordCardType[1]):false;
            recordCardType[2]?this.recordCardType[2].push(recordCardType[2]):false;


            if(this.data.authorityCount>0){
                this.authorityForm.authorityCount = 1;
                this.personCount = this.data.authorityCount;
            }else{
                this.authorityForm.authorityCount = this.data.authorityCount
            }
        }
    }
</script>
<style scoped>
    .remarks{
        font-size: 14px;
        color: #333333;
        line-height: 30px;
        margin:20px  0;
    }
    .el-input{
        width: 70px;
        margin: 0 10px;
    }
    .el-row{
        line-height:40px;
    }
</style>