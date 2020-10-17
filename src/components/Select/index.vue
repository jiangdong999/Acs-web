<template>
    <el-select 
        v-model="model"
        :filterable='filterable' 
        @change="$emit('change',$event)" 
        :placeholder="placeholder"
        :disabled="disabled"
        >
        <slot></slot>
    </el-select>
</template>
<script>
export default {
    props:['placeholder','filterable','autoSelect'],
    data(){
        return {
            model:"",
            disabled: false
        }
    },
    watch:{
        'autoSelect.forList':function(newList,oldList){

            if(newList !== oldList){
                if(newList.length == 1){
                    this.model = newList[0][this.autoSelect.key];
                    this.disabled = true;
                    this.$emit('change',this.model);


                    const roles = this.$store.getters && this.$store.getters.roles
                    const permissionRoles = 'ADMIN_ROLE'
                    this.disabled = !(roles.some(role => {
                        return permissionRoles.includes(role)
                    }))
                }else{
                    this.model="";
                }
            } 

            
        }
    }
}
</script>
