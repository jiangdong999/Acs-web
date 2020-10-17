<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="楼栋" prop="buildingCount">
        <el-input v-model="form.buildingCount" :maxlength="10" clearable placeholder="请输入"/>
        <el-radio-group v-model="form.buildingBlock" class="left20">
          <el-radio label="栋">栋</el-radio>
          <el-radio label="座">座</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单元" prop="unitNo">
        <el-input v-model="form.unitNo" :maxlength="5" clearable  placeholder="请输入">
          <template slot="append">单元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="楼层" prop="floorNo">
        <el-input v-model="form.floorNo" :maxlength="5" clearable  placeholder="请输入">
          <template slot="append">层</template>
        </el-input>
      </el-form-item>
      <el-form-item label="门牌号" prop="roomName">
        <el-input v-model="form.roomName" :maxlength="4" clearable placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="房间数量" prop="bedrooms">
        <el-input v-model="form.bedrooms" :maxlength="3" clearable placeholder="请输入">
          <template slot="append">间</template>
        </el-input>
      </el-form-item>
      <el-form-item label="建筑面积/㎡" prop="roomArea">
        <!-- <el-input v-model="form.roomArea" :maxlength="5" clearable placeholder="建筑面积">
          <template slot="append">㎡</template>
        </el-input> -->
        <el-input-number v-model="form.roomArea" :precision="1" :step="10" :min="1" :max="9999"></el-input-number>
      </el-form-item>
      <el-form-item label="房屋户型" prop="houseType">
        <el-input v-model="form.houseType" :maxlength="20" clearable placeholder="房屋户型"/>
      </el-form-item>
      <el-form-item label="房屋用途" prop="roomUse">
        <el-select v-model="form.roomUse" filterable placeholder="请选择">
          <el-option
            v-for="item in roomUseTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用状态" prop="roomUseStatus">
        <el-radio-group v-model="form.roomUseStatus">
          <el-radio :label="item.value" :key="item.value" v-for="item in roomUseStatusOptions">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房产性质" prop="roomProperty">
        <el-radio-group v-model="form.roomProperty">
          <el-radio :label="item.value" :key="item.value" v-for="item in roomPropertyOptions">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {saveRoom} from "@/api/room";
  import {validateNumber, validatePositiveNumber, validateDecimalsNumber} from "@/utils/rules"
  import {roomUseTypeOptions, roomUseStatusOptions, roomPropertyOptions} from "@/utils/options"
  import { mapGetters } from 'vuex';

  export default {
    name: "room-form",
    data() {
      return {
        loading: false,
        form: {
          buildingNo: '',
          buildingCount:'',
          buildingBlock: '栋',
          unitNo: '',
          floorNo: '',
          roomName: '',
          bedrooms: '',
          roomArea: '',
          houseType: '',
          roomUse: '',
          roomUseStatus: '',
          roomProperty: '',
        },
        roomUseTypeOptions,
        roomUseStatusOptions,
        roomPropertyOptions,
        rules: {
          buildingCount: [
            {required: true, message: '请输入楼栋号码', trigger: 'blur'},
            {message: '请输入数字', validator: validateNumber}
          ],
          unitNo: [
            {required: true, message: '请输入单元', trigger: 'blur'},
            {message: '请输入数字', validator: validateNumber}
          ],
          floorNo: [
            {required: true, message: '请输入楼层', trigger: 'blur'},
            {message: '请输入数字', validator: validateNumber}
          ],
          roomArea: [
            {message: '请输入正确的数字', validator: validateDecimalsNumber}
          ],
          bedrooms: [
            {message: '请输入正确的数字', validator: validatePositiveNumber}
          ],
          roomName: [
            {required: true, message: '请输入门牌号', trigger: 'blur'},
            {len: 4, message: '请输入4位数字的门牌号', trigger: 'blur'},
            {message: '请输入数字', validator: validateNumber}
          ],
          // roomUse: [
          //   {required: true, message: '请选择房屋用途', trigger: 'change'}
          // ],
          // roomUseStatus: [
          //   {required: true, message: '请选择使用状态', trigger: 'change'}
          // ],
          // roomProperty: [
          //   {required: true, message: '请选择房产性质', trigger: 'change'}
          // ],
        },
      }
    },
    computed:{
      ...mapGetters([
        'community'
      ])
    },
    methods: {
      handleSubmit: function (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            //1 + 栋 = 1栋
            self.loading = true;
            // let params = Object.assign(self.form, self.community)
            let params = {...self.form, ...self.community}
            params.buildingNo = self.form.buildingCount + self.form.buildingBlock;
            params.unitNo = self.form.unitNo + '单元';
            params.floorNo = self.form.floorNo + '层';
            saveRoom(params).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                self.loading = false;
                self.$parent.$parent.handleClose();
              }
            }).catch(function (a) {
              console.error(a)
              self.loading = false;
            });
          } else {
            // console.log('error submit!!');
          }
        });
      },
      handleClose: function () {
        this.$parent.handleClose();
      }
    },
    mounted() {
    },
  }
</script>

<style scoped>
  .left20{
    margin-left: 20px
  }
</style>
