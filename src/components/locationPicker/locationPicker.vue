<template>
  <div v-loading="loading">
    <el-select filterable clearable placeholder="省份" v-model="location[0].zoningCode"
                class="loc-item"
                @change="loadLocation(1, $event)"
                @clear="$emit('update:locationCode', null)"
                :disabled="disabled">
      <el-option v-for="item in location[0].list" 
                :value="item.code" 
                :label="item.name"
                :key="item.code"></el-option>
    </el-select>
    <el-select filterable clearable placeholder="城市" v-model="location[1].zoningCode"
                class="loc-item"
                @change="loadLocation(2, $event)"
                @clear="$emit('update:locationCode', location[0].zoningCode)"
                :disabled="disabled">
      <el-option v-for="item in location[1].list" 
                :value="item.code" 
                :label="item.name" 
                :key="item.code"></el-option>
    </el-select>
    <el-select filterable clearable placeholder="区/县" v-model="location[2].zoningCode"
                class="loc-item"
                @change="loadLocation(3, $event)"
                @clear="$emit('update:locationCode', location[1].zoningCode)"
                :disabled="disabled">
      <el-option v-for="item in location[2].list" 
                :value="item.code" 
                :label="item.name" 
                :key="item.code"></el-option>
    </el-select>
    <el-select filterable clearable placeholder="乡/镇/街道" v-model="location[3].zoningCode"
                class="loc-item"
                @change="loadLocation(4, $event)"
                @clear="$emit('update:locationCode', location[2].zoningCode)"
                :disabled="disabled">
      <el-option v-for="item in location[3].list" 
                :value="item.code"
                :label="item.name" 
                :key="item.code"></el-option>
    </el-select>
    <el-select filterable clearable placeholder="村/居委会" v-model="location[4].zoningCode"
                class="loc-item"
                @change="$emit('update:locationCode', $event)"
                @clear="$emit('update:locationCode', location[3].zoningCode)"
                :disabled="disabled">
      <el-option v-for="item in location[4].list" 
                :value="item.code" 
                :label="item.name" 
                :key="item.code"></el-option>
    </el-select>
  </div>
</template>
<script>
  import { getLocationDetail} from "@/api/location";
  import {getLocation} from "@/api/locationv1";

  export default {
    props:['locationCode', 'needLoadDetail', 'loadCode', 'disabled'],
    data(){
      return {
        loading: false,
        location: [
          {
            list: [],
            zoningCode: null
          },
          {
            list: [],
            zoningCode: null
          },
          {
            list: [],
            zoningCode: null
          },
          {
            list: [],
            zoningCode: null
          },
          {
            list: [],
            zoningCode: null
          }
        ]
      }
    },
    methods:{
      selectReset(level) {
        if (level <= 4) {
          this.location[level].zoningCode = null;
          level!==0 && (this.location[level].list = []);
          this.selectReset(level+1);
        }
      },
      loadLocation(loadLevel, zoningCode){
        // console.log(zoningCode)
        if (loadLevel > -1) {
          let isClear = zoningCode===null?true:false;
          this.selectReset(loadLevel);
          if(!isClear){
            this.$emit('update:locationCode', zoningCode);

            let self = this;
            getLocation({
              level: loadLevel,
              zoningCode: zoningCode
            }).then(function (response) {
              if(response.data && response.data.status==0) {
                self.location[loadLevel].list = response.data.content;
              }
            }).catch(function (a) {
              console.error(a);
            })
          }
        }
      },
      loadDetail(loadCode){
        let self = this;
        if(loadCode){
          self.loading = true;
          getLocationDetail({
            zoningCode: loadCode
          }).then(function (response) {
            if(response.data && response.data.code==1) {
              let data = response.data.data;
              self.location[0].zoningCode = data.provinceCode;
              self.location[1].zoningCode = data.cityCode;
              self.location[2].zoningCode = data.areaCode;
              self.location[3].zoningCode = data.streetCode;
              self.location[4].zoningCode = data.code;
              self.initLocation(1, self.location[0].zoningCode)
            }
            console.log(self.location);
          }).catch(function (a) {
            console.error(a);
          })
        }
      },
      initLocation(loadLevel, zoningCode){
        let self = this;
        getLocation({
          level: loadLevel,
          zoningCode: zoningCode
        }).then(function (response) {
          if(response.data && response.data.status==0) {
            self.location[loadLevel].list = response.data.content;

            if(loadLevel+1 <= 4){
              self.initLocation(loadLevel+1, self.location[loadLevel].zoningCode)
            }
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          if(loadLevel==4){
            self.loading = false;
          }
        })
      }
    },
    mounted() {
      if(this.needLoadDetail){
        // 不用nexttick的话loadcode为空字符串，原因不明
        this.$nextTick(()=>{
          this.loadDetail(this.loadCode);
        })
      }
      this.loadLocation(0);
    }
  }
</script>

<style scoped>
  .loc-item{
    /* margin-right: 15px; */
    margin-bottom: 6px;
  }
</style>
