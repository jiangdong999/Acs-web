<template>
  <div class="device-config JDdeviceConfig">
    <div class="backTop">
      <span class="back" @click="$router.back()">
        <i class="el-icon-arrow-left back-icon"></i>返回
      </span>
      <span class="title">设备配置</span>
      <el-button class="save-btn" type="primary" @click="clickSave" :loading="btnLoading">保存</el-button>
    </div>
    <div class="setting-detail">
      <el-form
        ref="basicForm"
        :model="basicForm"
        :inline="true"
        :rules="basicRule"
        class="congfigTop"
      >
        <el-form-item label="所属小区" prop="communityId">
          <el-select
            v-model="basicForm['communityId']"
            placeholder="请选择"
            :disabled="isCopy"
            filterable
          >
            <el-option
              v-for="item in communityList"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="doorType">
          <el-select
            v-model="basicForm['doorType']"
            @change="getConfigFormDoorType($event)"
            placeholder="请选择"
            :disabled="isCopy"
          >
            <el-option
              v-for="item in devTypeList"
              :key="item.code"
              :label="item.codeName"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称" prop="configName">
          <el-input
            type="text"
            :maxlength="20"
            v-model="basicForm['configName']"
            clearable
            :disabled="isOnlyRead"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <!-- 硬件配置 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="硬件配置" name="one">
          <el-form ref="hardwareForm" :model="hardwareForm" :inline="true" :rules="hardwareRule">
            <el-row>
              <el-col :span="6">
                <el-form-item label="开门时长" prop="101">
                  <el-input
                    type="text"
                    :disabled="isOnlyRead"
                    :maxlength="3"
                    @input="hardwareForm['101']=hardwareForm['101'].replace(/[^\d]/g,'')"
                    v-model="hardwareForm['101']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">秒</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="蓝牙开关" prop="102" class="reLaunch-red">
                  <el-select v-model="hardwareForm['102']" :disabled="isOnlyRead" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="红外感光开关" prop="103">
                  <el-select :disabled="isOnlyRead" v-model="hardwareForm['103']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="继电器反转开关" prop="104" class="longLabel">
                  <el-select :disabled="isOnlyRead" v-model="hardwareForm['104']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="卡号读取反序" prop="105" class="reLaunch-red">
                  <el-select :disabled="isOnlyRead" v-model="hardwareForm['105']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item label="断网状态锁常开开关" prop="106" class="longLabel">
                  <el-select :disabled="isOnlyRead" v-model="hardwareForm['106']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="门磁超时时长" prop="107">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    :maxlength="2"
                    @input="hardwareForm['107']=hardwareForm['107'].replace(/[^\d]/g,'')"
                    v-model="hardwareForm['107']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">秒</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="看门狗功能" prop="108">
                  <el-select :disabled="isOnlyRead" v-model="hardwareForm['108']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="防复制卡开关" prop="109">
                  <el-select v-model="hardwareForm['109']" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- 摄像头配置 -->
        <el-tab-pane label="摄像头配置" name="two">
          <el-form ref="cameraForm" :model="cameraForm" :rules="cameraRule" :inline="true">
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="摄像头类型" prop="201">
                  <el-select :disabled="isOnlyRead" v-model="cameraForm['201']" placeholder="请选择">
                    <el-option
                      v-for="item in cameraTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人脸识别摄像头角度" prop="202" class="longLabel">
                  <el-select :disabled="isOnlyRead" v-model="cameraForm['202']" placeholder="请选择">
                    <el-option
                      v-for="item in cameraAngleOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item label="录像功能开关" prop="209">
                  <el-select
                    :change="configLinkage.cameraOpenBtn(cameraForm['209'])"
                    :disabled="isOnlyRead"
                    v-model="cameraForm['209']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通行记录视频" prop="203">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.cameraOpenFlag"
                    v-model="cameraForm['203']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in uploadVedioOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录像策略" prop="205">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.cameraOpenFlag"
                    v-model="cameraForm['205']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in cameraMethodOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录像音频开关" prop="206">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.cameraOpenFlag"
                    v-model="cameraForm['206']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="录像策略(防拆/开门/输入/人脸/人体传感器)" prop="207" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.cameraOpenFlag"
                    type="text"
                    :maxlength="8"
                    @input="cameraForm['207']=cameraForm['207'].replace(/[^01]/g,'')"
                    v-model="cameraForm['207']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录像开门视频时长配置" prop="208" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.cameraOpenFlag"
                    type="text"
                    @input="cameraForm['208']=cameraForm['208'].replace(/[^\d\|]/g,'')"
                    v-model="cameraForm['208']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- 照明配置 -->
        <el-tab-pane label="照明配置" name="three">
          <el-form ref="lightForm" :model="lightForm" :rules="lightRule" :inline="true">
            <el-row>
              <el-col :span="6">
                <el-form-item label="补光灯开关" prop="301">
                  <el-select
                    :disabled="isOnlyRead"
                    :change="configLinkage.lightOpenBtn(lightForm['301'])"
                    v-model="lightForm['301']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="补光灯打开阈值" prop="302" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.lightOpenFlag"
                    type="text"
                    @input="lightForm['302']=lightForm['302'].replace(/[^\d]/g,'')"
                    v-model="lightForm['302']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="补光灯关闭阈值" prop="303" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.lightOpenFlag"
                    type="text"
                    @input="lightForm['303']=lightForm['303'].replace(/[^\d]/g,'')"
                    v-model="lightForm['303']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="补光灯最大亮度" prop="304" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.lightOpenFlag"
                    type="text"
                    :maxlength="3"
                    @input="lightForm['304']=lightForm['304'].replace(/[^\d]/g,'')"
                    v-model="lightForm['304']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="补光灯定时开关时间" class="longLabel">
                  <el-time-picker
                    :disabled="isOnlyRead || configLinkage.lightOpenFlag"
                    class="formatTime"
                    v-model="startTime"
                    format="HH:mm"
                    placeholder="请选择"
                    value-format="HH:mm"
                  ></el-time-picker>
                </el-form-item>
                <span style="margin-top: 40px;display: inline-block;margin-right: 8px;">至</span>
                <el-form-item class="timeRange-item" style="margin-top: 31px">
                  <el-time-picker
                    :disabled="isOnlyRead || configLinkage.lightOpenFlag"
                    class="formatTime"
                    v-model="endTime"
                    format="HH:mm"
                    placeholder="请选择"
                    value-format="HH:mm"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="屏幕延迟变暗时间" prop="306" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    @input="lightForm['306']=lightForm['306'].replace(/[^\d]/g,'')"
                    v-model="lightForm['306']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">秒</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="屏幕延迟熄灭时间" prop="307" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    @input="lightForm['307']=lightForm['307'].replace(/[^\d]/g,'')"
                    v-model="lightForm['307']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">秒</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="屏幕亮度自动调节" prop="308" class="longLabel">
                  <el-select :disabled="isOnlyRead" v-model="lightForm['308']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="屏幕白天亮度" prop="309">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    :maxlength="3"
                    @input="lightForm['309']=lightForm['309'].replace(/[^\d]/g,'')"
                    v-model="lightForm['309']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="屏幕夜间亮度" prop="310">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    :maxlength="3"
                    @input="lightForm['310']=lightForm['310'].replace(/[^\d]/g,'')"
                    v-model="lightForm['310']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="呼吸灯工作开关" prop="311" class="longLabel">
                  <el-select :disabled="isOnlyRead" v-model="lightForm['311']" placeholder="请选择">
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- 音量配置 -->
        <el-tab-pane label="音量配置" name="four">
          <el-form ref="soundForm" :model="soundForm" :rules="soundRule" :inline="true">
            <el-row>
              <el-col :span="6">
                <el-form-item label="媒体音量开关" prop="401">
                  <el-select
                    :change="configLinkage.soundOpenBtn(soundForm['401'])"
                    :disabled="isOnlyRead"
                    v-model="soundForm['401']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="白天媒体音量" prop="402">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['402']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="白天通话音量" prop="403">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['403']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="白天语音音量" prop="404">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['404']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="白天按键音量" prop="405">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    type="text"
                    :maxlength="3"
                    @input="soundForm['405']=soundForm['405'].replace(/[^\d]/g,'')"
                    v-model="soundForm['405']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="夜晚媒体音量" prop="406">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['406']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="夜晚通话音量" prop="407">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['407']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="夜晚语音音量" prop="408">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    v-model="soundForm['408']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="夜晚按键音量" prop="409">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.soundOpenFlag"
                    type="text"
                    :maxlength="3"
                    @input="soundForm['409']=soundForm['409'].replace(/[^\d]/g,'')"
                    v-model="soundForm['409']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- 刷脸配置 -->
        <el-tab-pane label="刷脸配置" name="five">
          <el-form ref="faceForm" :model="faceForm" :rules="faceRule" :inline="true">
            <el-row>
              <el-col :span="6">
                <el-form-item label="刷脸方式" prop="501" class="reLaunch-red">
                  <el-select
                    :change="configLinkage.faceOpenBtn(faceForm['501'])"
                    :disabled="isOnlyRead"
                    v-model="faceForm['501']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in faceTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Facepass SDK识别阈值" prop="502" class="longLabel reLaunch-red">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.faceOpenFlag"
                    type="text"
                    :maxlength="5"
                    @input="faceForm['502']=faceForm['502'].replace(/[^0-9.]/g,'')"
                    v-model="faceForm['502']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Facepass识别阈值" prop="503" class="longLabel reLaunch-red">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.faceOpenFlag"
                    type="text"
                    :maxlength="5"
                    @input="faceForm['503']=faceForm['503'].replace(/[^0-9.]/g,'')"
                    v-model="faceForm['503']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Facepass活体阈值" prop="504" class="longLabel reLaunch-red">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.faceOpenFlag"
                    type="text"
                    :maxlength="5"
                    @input="faceForm['504']=faceForm['504'].replace(/[^0-9.]/g,'')"
                    v-model="faceForm['504']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="Facepass最小人脸尺寸" prop="505" class="longLabel reLaunch-red">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.faceOpenFlag"
                    type="text"
                    :maxlength="3"
                    @input="faceForm['505']=faceForm['505'].replace(/[^\d]/g,'')"
                    v-model="faceForm['505']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Facepass人脸模糊度阈值" prop="506" class="longLabel reLaunch-red">
                  <el-input-number
                    :disabled="isOnlyRead || configLinkage.faceOpenFlag"
                    v-model="faceForm['506']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
                <el-form-item label="百度 授权序列号" prop="百度 授权序列号" class="baidu">
                  <el-input type="text" v-model="faceForm['百度 授权序列号']" clearable placeholder="请输入">
                  </el-input>
                </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item label="百度 活体阈值" prop="508" class="reLaunch-red">
                  <el-input-number
                    :disabled="isOnlyRead || !configLinkage.faceOpenFlag"
                    v-model="faceForm['508']"
                    :precision="1"
                    :step="0.1"
                    :min="0"
                    :max="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="百度 识别阈值" prop="509" class="reLaunch-red">
                  <el-input
                    :disabled="isOnlyRead || !configLinkage.faceOpenFlag"
                    type="text"
                    :maxlength="5"
                    @input="faceForm['509']=faceForm['509'].replace(/[^0-9.]/g,'')"
                    v-model="faceForm['509']"
                    clearable
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- 其他配置 -->
        <el-tab-pane label="其他配置" name="six">
          <el-form ref="otherForm" :model="otherForm" :rules="otherRule" :inline="true">
            <el-row>
              <el-col :span="6">
                <el-form-item label="CPU高温阈值" prop="601">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    :maxlength="3"
                    @input="otherForm['601']=otherForm['601'].replace(/[^\d]/g,'')"
                    v-model="otherForm['601']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">℃</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="流量告警阈值" prop="602">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    @input="otherForm['602']=otherForm['602'].replace(/[^\d]/g,'')"
                    v-model="otherForm['602']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">M</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预留最小剩余空间" prop="603" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    @input="otherForm['603']=otherForm['603'].replace(/[^\d]/g,'')"
                    v-model="otherForm['603']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">M</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="门常开告警时间" prop="604" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead"
                    type="text"
                    @input="otherForm['604']=otherForm['604'].replace(/[^\d]/g,'')"
                    v-model="otherForm['604']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">秒</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="白天黑夜判断(自动)" prop="605" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead"
                    :change="configLinkage.dayNightOpenBtn(otherForm['605'])"
                    v-model="otherForm['605']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="白天起始时间(手动)" prop="606" class="longLabel">
                  <el-time-picker
                    :disabled="isOnlyRead || !configLinkage.dayNightOpenFlag"
                    class="formatTime"
                    v-model="otherForm['606']"
                    format="HH:mm"
                    placeholder="请选择"
                    value-format="HH:mm"
                    :picker-options="{
                      selectableRange: dayStartTimeRange
                    }"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="白天结束时间(手动)" prop="607" class="longLabel">
                  <el-time-picker
                    :disabled="isOnlyRead || !configLinkage.dayNightOpenFlag"
                    class="formatTime"
                    v-model="otherForm['607']"
                    format="HH:mm"
                    placeholder="请选择"
                    value-format="HH:mm"
                    :picker-options="{
                      selectableRange: dayEndTimeRange
                    }"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="睿视摄像头升降固件" prop="608" class="longLabel">
                  <el-select v-model="otherForm['睿视摄像头升降固件']" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in liftOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="重启策略" prop="608">
                  <el-select
                    :disabled="isOnlyRead"
                    @change="chgMethods()"
                    v-model="otherForm['608']"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in restartOption"
                      :key="+item.value"
                      :label="item.label"
                      :value="+item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="定期重启时间" prop="609" class="reStart">
                  <el-input v-if="methodType==0" type="text" :disabled="true"></el-input>
                  <el-select
                    :disabled="isOnlyRead"
                    v-if="methodType==2"
                    v-model="otherForm['609']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in dayOption"
                      :key="item.value"
                      :label="item.label"
                      :value="+item.value"
                    ></el-option>
                  </el-select>
                  <el-time-picker
                    :disabled="isOnlyRead"
                    class="formatTime"
                    v-if="methodType==2"
                    placeholder="请选择"
                    v-model="reStartTime"
                    format="HH:mm"
                    value-format="HH:mm"
                  ></el-time-picker>
                  <el-time-picker
                    :disabled="isOnlyRead"
                    class="formatTime"
                    v-if="methodType==1"
                    placeholder="请选择"
                    v-model="otherForm['609']"
                    format="HH:mm"
                    value-format="HH:mm"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备ADB开关" prop="610">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['610']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="OTA升级是否设置门常开" prop="611" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['611']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="是否上报开关开门记录" prop="701" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['701']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否上报开门记录图片" prop="704" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['704']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="应用自更新" prop="995">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['995']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="图片上传方式" prop="712">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['712']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in imgUpload"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="项目类型" prop="708">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['708']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in projectOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目背景图" prop="709">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['709']"
                    placeholder="请选择"
                    @change="projectMethods()"
                    clearable
                  >
                    <el-option
                      v-for="item in projectBJOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div style="display: inline-block;" v-show="bgInputShow">
                    <el-input placeholder="请输入http://" v-model="bgInput" clearable></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="logo设置" prop="705">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['705']"
                    placeholder="请选择"
                    @change="logoMethods()"
                    clearable
                  >
                    <el-option
                      v-for="item in logoOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div style="display: inline-block;" v-show="logoInputShow">
                    <el-input placeholder="请输入http://" v-model="logoInput" clearable></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二维码设置" prop="718">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['718']"
                    placeholder="请选择"
                    @change="QRcodeMethods()"
                    clearable
                  >
                    <el-option
                      v-for="item in QRcodeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div style="display: inline-block;" v-show="QRcodeInputShow">
                    <el-input placeholder="请输入http://" v-model="QRcodeInput" clearable></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="PSTN供应商" prop="716">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['716']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in pstnVendorOptino"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="暴力开门" prop="717">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['717']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in violenceDoorOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <h3>健康宝、测温配置</h3>
            <el-row>
              <el-col :span="6">
                <el-form-item label="“四合一”检测模式" prop="994">
                  <el-select
                    :change="configLinkage.fourAndOneOpenBtn(otherForm['994'])"
                    :disabled="isOnlyRead"
                    v-model="otherForm['994']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in fourAndOneOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人证比对" prop="719" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.fourAndOneOpenFlag"
                    v-model="otherForm['719']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in witnessescontrastOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="签到成功是否开门" prop="720" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.fourAndOneOpenFlag"
                    v-model="otherForm['720']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in signInOpenDoorOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="是否走测温流程" prop="700" class="longLabel">
                  <el-select
                    :change="configLinkage.temTestOpenBtn(otherForm['700'])"
                    :disabled="isOnlyRead"
                    v-model="otherForm['700']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="非白名单是否测温" prop="714" class="longLabel">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.temTestOpenFlag"
                    v-model="otherForm['714']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in whiteListOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="体温异常是否开门" prop="710">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.temTestOpenFlag"
                    v-model="otherForm['710']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in temperatureGate"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="检查健康宝状态" prop="706">
                  <el-select
                    :change="configLinkage.JKBstateOpenBtn(otherForm['706'])"
                    :disabled="isOnlyRead"
                    v-model="otherForm['706']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="健康宝查询方式" prop="713">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.JKBstateOpenFlag"
                    v-model="otherForm['713']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in checkHealthApp"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="睿家健康宝数据本地有效时长" prop="715" class="longLabel">
                  <el-input
                    :disabled="isOnlyRead || configLinkage.JKBstateOpenFlag"
                    type="text"
                    :maxlength="3"
                    @input="otherForm['715']=otherForm['715'].replace(/[^\d]/g,'')"
                    v-model="otherForm['715']"
                    clearable
                    placeholder="请输入"
                  >
                    <span slot="suffix">天</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="健康宝可开门权限" prop="711">
                  <el-select
                    :disabled="isOnlyRead || configLinkage.JKBstateOpenFlag"
                    v-model="otherForm['711']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in healthAppGate"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="健康调查问卷" prop="707">
                  <el-select
                    :disabled="isOnlyRead"
                    v-model="otherForm['707']"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in switchOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="临时配置" name="seven" class="temForm">
          <el-button @click="showDialog" type="primary">+新增临时配置</el-button>
          <div class="temContainer">
            <div class="temContainer-item" v-for="(item,key) of temForm" :key="key">
              <p>
                <span>{{item.name}}</span>
                <span>key:&nbsp;&nbsp;{{item.key}}</span>
              </p>
              <el-input v-model="item.value" @input="changeTemList(item)"></el-input>
              <el-button @click="deleteTemList(item,key)" type="danger" icon="el-icon-delete"></el-button>
            </div>
            <div v-if="showModal">
              <el-dialog
                title="添加临时配置"
                :visible.sync="showModal"
                width="440px"
                :close-on-click-modal="false"
              >
                <el-form
                  label-position="top"
                  ref="newtemForm"
                  :model="newtemForm"
                  :rules="temListRule"
                >
                  <el-form-item label="name" prop="newName">
                    <el-input v-model="newtemForm.newName" :maxlength="12" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="value" prop="newValue">
                    <el-input v-model="newtemForm.newValue" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="key" prop="newKey">
                    <el-input v-model="newtemForm.newKey" type="number" clearable></el-input>
                  </el-form-item>

                  <div class="form-dialog-control-area">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="addTemporaryForm">确定</el-button>
                  </div>
                </el-form>
              </el-dialog>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  cameraTypeOption,
  cameraAngleOption,
  switchOption,
  uploadVedioOption,
  faceTypeOption,
  liftOption,
  deviceTypeOption,
  restartOption,
  dayOption,
  cameraMethodOption,
  logoOption,
  projectOption,
  projectBJOption,
  hardwareCheck,
  cameraCheck,
  lightCheck,
  soundCheck,
  faceCheck,
  otherCheck,
  whiteListOption,
  JKBDataOption,
  pstnVendorOptino,
  fourAndOneOption,
  violenceDoorOption,
  QRcodeOption,
  witnessescontrastOption,
  signInOpenDoorOption,
  healthAppGate,
  imgUpload,
  temperatureGate,
  checkHealthApp,
} from "@/utils/configOption";
import { configLinkage } from "@/utils/configLinkage";
import { regExp, validateNum } from "@/utils/configCheck";
import { mapGetters } from "vuex";
import {
  addConfig,
  editConfig,
  configDetails,
  getDefaultConfig,
} from "@/api/config";
import bus from "@/utils/bus";
import Vue from "vue";

export default {
  name: "device-config",
  computed: {
    ...mapGetters(["communityList", "devTypeList"]),
    timeRange: {
      set(newValue) {
        this.startTime = newValue ? newValue.split("-")[0] : "";
        this.endTime = newValue ? newValue.split("-")[1] : "";
      },
      get() {
        return this.startTime && this.endTime
          ? this.startTime + "-" + this.endTime
          : "";
      },
    },
    //补光灯起始和结束时间限制
    // startTimeRange: {
    //   get(){
    //     if(this.endTime){
    //       let hour = this.endTime.split(':')[0]
    //       let minute = +this.endTime.split(':')[1]-1
    //       let time = `${hour}:${minute}`
    //       return `00:00:00 - ${time}:59`
    //     }
    //     else {
    //       return '00:00:00 - 23:59:59'
    //     }
    //   }
    // },
    // endTimeRange: {
    //   get(){
    //     if(this.startTime){
    //       let hour = this.startTime.split(':')[0]
    //       let minute = +this.startTime.split(':')[1]+1
    //       let time = `${hour}:${minute}`
    //       return `${time}:00 - 23:59:59`
    //     }
    //     else {
    //       return '00:00:00 - 23:59:59'
    //     }
    //   }
    // },
    dayStartTimeRange: {
      get() {
        if (this.otherForm["607"]) {
          let hour = +this.otherForm["607"].split(":")[0];
          let minute = +this.otherForm["607"].split(":")[1];
          let time;
          if (minute == 0) {
            time = `${hour - 1}:59`;
          } else {
            time = `${hour}:${minute - 1}`;
          }
          return `00:00:00 - ${time}:59`;
        } else {
          return "00:00:00 - 23:59:59";
        }
      },
    },
    dayEndTimeRange: {
      get() {
        if (this.otherForm["606"]) {
          let hour = this.otherForm["606"].split(":")[0];
          let minute = +this.otherForm["606"].split(":")[1] + 1;
          let time = `${hour}:${minute}`;
          return `${time}:00 - 23:59:59`;
        } else {
          return "00:01:00 - 23:59:59";
        }
      },
    },
  },
  data() {
    return {
      bgInput: "",
      bgInputShow: false,
      logoInputShow: false,
      logoInput: "",
      QRcodeInput: "",
      QRcodeInputShow: false,
      cameraTypeOption,
      cameraAngleOption,
      projectOption,
      projectBJOption,
      logoOption,
      switchOption,
      faceTypeOption,
      liftOption,
      restartOption,
      checkHealthApp,
      temperatureGate,
      imgUpload,
      healthAppGate,
      dayOption,
      deviceTypeOption,
      uploadVedioOption,
      cameraMethodOption,
      healthAppGate,
      imgUpload,
      temperatureGate,
      checkHealthApp,
      hardwareCheck,
      cameraCheck,
      lightCheck,
      soundCheck,
      faceCheck,
      otherCheck,
      whiteListOption,
      JKBDataOption,
      pstnVendorOptino,
      fourAndOneOption,
      violenceDoorOption,
      QRcodeOption,
      witnessescontrastOption,
      signInOpenDoorOption,
      isCopy: false,
      isOnlyRead: false,
      deviceId: "",
      deviceType: "",
      activeName: "one",
      btnLoading: false,
      methodType: 0,
      basicForm: {
        configName: "",
        communityId: "",
        deviceType: "",
        configId: "",
      },
      basicRule: {
        configName: [
          { required: true, message: "请输入配置名称", trigger: "blur" },
        ],
        communityId: [
          { required: true, message: "请选择所属小区", trigger: "change" },
        ],
        doorType: [
          { required: true, message: "请选择设备型号", trigger: "change" },
        ],
      },
      hardwareForm: {
        "101": 5,
        "102": 1,
        "103": 1,
        "104": 0,
        // '105': 0,
        "106": 0,
        "107": 10,
        "108": 1,
        // "109": 0,
      },
      hardwareRule: {
        "101": [
          { required: true, message: "请输入1~999以内的整数", trigger: "blur" },
          {
            pattern: regExp.thousand,
            message: "请输入1~999以内的整数",
            trigger: "blur",
          },
        ],
        "102": [
          { required: true, message: "请选择蓝牙开关", trigger: "change" },
        ],
        "103": [
          { required: true, message: "请选择红外感光开关", trigger: "change" },
        ],
        "104": [
          {
            required: true,
            message: "请选择继电器反转开关",
            trigger: "change",
          },
        ],
        // '105': [
        //   {required: true, message: '请选择卡号读取反序', trigger: 'change'},
        // ],
        "106": [
          {
            required: true,
            message: "请选择断网状态锁常开开关",
            trigger: "change",
          },
        ],
        "107": [
          { required: true, message: "请输入0~10以内的整数", trigger: "blur" },
          {
            pattern: regExp.ten,
            message: "请输入0~10以内的整数",
            trigger: "blur",
          },
        ],
        "108": [
          { required: true, message: "请选择看门狗功能", trigger: "change" },
        ],
        // "109": [
        //   { required: true, message: "请选择防复制卡开关", trigger: "change" },
        // ],
      },
      cameraForm: {
        // '201': 0,
        // '202': 90,
        "203": 0,
        // '204': '15',
        "205": 0,
        "206": 1,
        "207": "00011111",
        "208": "5|10",
        "209": 0,
      },
      cameraRule: {
        // '201': [
        //   {required: true, message: '请选择摄像头类型', trigger: 'change'},
        // ],
        // '202': [
        //   {required: true, message: '请选择人脸识别摄像头角度', trigger: 'change'},
        // ],
        "203": [{ required: true, message: "请选择", trigger: "change" }],
        // '204': [
        //   {required: true, message: '请输入0~86400以内的整数', trigger: 'blur'},
        //   {pattern: regExp.tenthousand, message: '请输入0~86400以内的整数'},
        //   {validator: validateNum, message: '请输入0~86400以内的整数', trigger: 'blur'},
        // ],
        "205": [{ required: true, message: "请选择", trigger: "change" }],
        "209": [{ required: true, message: "请选择", trigger: "change" }],
      },
      startTime: "",
      endTime: "",
      lightForm: {
        "301": 1,
        "302": 20,
        "303": 50,
        "304": 30,
        "305": "",
        "306": 0,
        "307": 999999,
        "308": 0,
        "309": 60,
        "310": 40,
        // "311": 1,
      },
      lightRule: {
        "301": [
          { required: true, message: "请选择补光灯开关", trigger: "change" },
        ],
        "302": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "303": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "304": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.twofivefive,
            message: "请输入0~255以内的整数",
            trigger: "blur",
          },
        ],
        "306": [
          { required: true, message: "请输入大于等于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeroAndMore,
            message: "请输入大于等于0的整数",
            trigger: "blur",
          },
        ],
        "307": [
          { required: true, message: "请输入大于等于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeroAndMore,
            message: "请输入大于等于0的整数",
            trigger: "blur",
          },
        ],
        "308": [
          {
            required: true,
            message: "请选择屏幕亮度是否自动调节",
            trigger: "change",
          },
        ],
        "309": [
          { required: true, message: "请输入0~100以内的整数", trigger: "blur" },
          {
            pattern: regExp.hundred,
            message: "请输入0~100以内的整数",
            trigger: "blur",
          },
        ],
        "310": [
          { required: true, message: "请输入0~100以内的整数", trigger: "blur" },
          {
            pattern: regExp.hundred,
            message: "请输入0~100以内的整数",
            trigger: "blur",
          },
        ],
        // "311": [
        //   {
        //     required: true,
        //     message: "请选择呼吸灯工作开关",
        //     trigger: "change",
        //   },
        // ],
      },
      soundForm: {
        "401": 1,
        "402": 0.8,
        "403": 0.8,
        "404": 0.8,
        "405": 80,
        "406": 0.5,
        "407": 0.5,
        "408": 0.5,
        "409": 30,
      },
      soundRule: {
        "401": [
          { required: true, message: "请选择媒体音量开关", trigger: "change" },
        ],
        "402": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "403": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "404": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "405": [
          { required: true, message: "请输入0~100以内的整数", trigger: "blur" },
          {
            pattern: regExp.hundred,
            message: "请输入0~100以内的整数",
            trigger: "blur",
          },
        ],
        "406": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "407": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "408": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "409": [
          { required: true, message: "请输入0~100以内的整数", trigger: "blur" },
          {
            pattern: regExp.hundred,
            message: "请输入0~100以内的整数",
            trigger: "blur",
          },
        ],
      },
      faceForm: {
        "501": 1,
        "502": 64,
        "503": 64,
        "504": 1,
        "505": "80",
        "506": 0.5,
        "508": 0.8,
        "509": 90,
      },
      faceRule: {
        "501": [
          { required: true, message: "请选择刷脸方式", trigger: "change" },
        ],
        "502": [
          { required: true, message: "请输入0~100以内的数", trigger: "blur" },
          {
            pattern: regExp.hundredPointTwo,
            message: "请输入0~100以内的数",
            trigger: "blur",
          },
        ],
        "503": [
          { required: true, message: "请输入0~100以内的数", trigger: "blur" },
          {
            pattern: regExp.hundredPointTwo,
            message: "请输入0~100以内的数",
            trigger: "blur",
          },
        ],
        "504": [
          { required: true, message: "请输入0~100以内的数", trigger: "blur" },
          {
            pattern: regExp.hundredPointTwo,
            message: "请输入0~100以内的数",
            trigger: "blur",
          },
        ],
        "505": [
          { required: true, message: "请输入0~255以内的整数" },
          {
            pattern: +regExp.twofivefive,
            message: "请输入0~255以内的整数",
            trigger: "blur",
          },
        ],
        "506": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "508": [
          {
            required: true,
            message: "请输入0.0~1.0以内的一位小数",
            trigger: "change",
          },
        ],
        "509": [
          { required: true, message: "请输入0~100以内的数", trigger: "blur" },
          {
            pattern: regExp.hundredPointTwo,
            message: "请输入0~100以内的数",
            trigger: "blur",
          },
        ],
      },
      reStartTime: "",
      otherForm: {
        "601": 80,
        "602": 500,
        "603": 500,
        "604": 3600,
        "605": 1,
        "606": "07:00",
        "607": "19:00",
        "608": 1,
        "609": "04:00",
        "610": 0,
        "611": 1,
        "700": 0,
        "701": 0,
        "704": 0,
        "705": "1",
        "706": 0,
        "707": 0,
        "708": 0,
        "709": "1",
        "710": 1,
        "711": 0,
        "712": 0,
        "713": 2,
        "714": 1,
        "715": 30,
        "716": "RJ-PSTN-P200",
        "717": 0,
        "718": "1",
        "719": 0,
        "720": 1,
        "994": 0,
        "995": 1,
      },
      otherRule: {
        "601": [
          { required: true, message: "请输入0~100以内的整数", trigger: "blur" },
          {
            pattern: regExp.hundred,
            message: "请输入0~100以内的整数",
            trigger: "blur",
          },
        ],
        "602": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "603": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "604": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "605": [{ required: true, message: "请选择", trigger: "change" }],
        "608": [
          { required: true, message: "请选择重启策略", trigger: "change" },
        ],
        "609": [{ required: false, message: "请选择", trigger: "change" }],
        "610": [{ required: true, message: "请选择", trigger: "change" }],
        "611": [{ required: true, message: "请选择", trigger: "change" }],
        "700": [{ required: true, message: "请选择", trigger: "change" }],
        "701": [{ required: true, message: "请选择", trigger: "change" }],
        "704": [{ required: true, message: "请选择", trigger: "change" }],
        "705": [{ required: true, message: "请选择", trigger: "change" }],
        "706": [{ required: true, message: "请选择", trigger: "change" }],
        "707": [{ required: true, message: "请选择", trigger: "change" }],
        "708": [{ required: true, message: "请选择", trigger: "change" }],
        "709": [{ required: true, message: "请选择", trigger: "change" }],
        "710": [{ required: true, message: "请选择", trigger: "change" }],
        "711": [{ required: true, message: "请选择", trigger: "change" }],
        "712": [{ required: true, message: "请选择", trigger: "change" }],
        "713": [{ required: true, message: "请选择", trigger: "change" }],
        "714": [{ required: true, message: "请选择", trigger: "change" }],
        "715": [
          { required: true, message: "请输入大于0的整数", trigger: "blur" },
          {
            pattern: regExp.zeromore,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
        "716": [{ required: true, message: "请选择", trigger: "change" }],
        "717": [{ required: true, message: "请选择", trigger: "change" }],
        "718": [{ required: true, message: "请选择", trigger: "change" }],
        "719": [{ required: true, message: "请选择", trigger: "change" }],
        "720": [{ required: true, message: "请选择", trigger: "change" }],
        "994": [{ required: true, message: "请选择", trigger: "change" }],
        "995": [{ required: true, message: "请选择", trigger: "change" }],
      },
      type: "",
      showModal: false,
      temForm: [],
      newtemForm: {
        newName: "",
        newValue: "",
        newKey: "",
      },
      temListRule: {
        newName: [{ required: true, message: "请输入", trigger: "blur" }],
        newValue: [{ required: true, message: "请输入", trigger: "blur" }],
        newKey: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      configLinkage,
    };
  },
  created() {
    let query = JSON.parse(localStorage.getItem('query'))
    let params = query;
    this.type = params.type;
    if (params.type === "copy") {
      this.basicForm.communityId = params.communityId;
      this.basicForm.doorType = params.doorType;
      this.basicForm.configName = `${params.configName}的副本`;
      this.basicForm.configId = params.configId;
      this.isCopy = true;
    } else if (params.type === "edit") {
      this.basicForm.communityId = params.communityId;
      this.basicForm.doorType = params.doorType;
      this.basicForm.configName = params.configName;
      this.basicForm.configId = params.configId;
      this.isCopy = true;
      // console.log(params);
      // this.isOnlyRead = params.isDefault==1 ? true : false
    } else if (params.type === "add") {
      this.isCopy = false;
    }
  },
  mounted() {
    let query = JSON.parse(localStorage.getItem('query'))
    this.deviceId = query.deviceId;
    this.deviceType = query.deviceType;
    this.deviceCode = query.deviceCode;
    if (this.type === "copy" || this.type === "edit") {
      this.searchSetting();
    } else {
      this.valid();
    }
  },
  methods: {
    showDialog() {
      this.showModal = true;
    },
    //添加临时配置
    addTemporaryForm() {
      const that = this;
      console.log(
        that.newtemForm.newName,
        that.newtemForm.newValue,
        that.newtemForm.newKey,
        that.temForm
      );
      that.$refs.newtemForm.validate((valid) => {
        if (valid) {
          that.temForm.push({
            name: that.newtemForm.newName,
            value: that.newtemForm.newValue,
            key: that.newtemForm.newKey,
          });
          that.handleClose();
        } else {
          return false;
        }
      });
    },
    //关闭临时配置弹窗
    handleClose() {
      const that = this;
      that.newtemForm.newKey = "";
      that.newtemForm.newName = "";
      that.newtemForm.newValue = "";

      that.showModal = false;
    },
    //修改临时配置
    changeTemList(item) {
      const that = this;
      // console.log(item.value);
      for (let i = 0; i < temForm.length; i++) {
        if (temForm[i].key == item.key) {
          temForm[i].value = item.value;
        }
      }
    },
    //删除临时配置
    deleteTemList(item, key) {
      const that = this;
      this.$confirm(`是否删除“${item.name}”？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });

          that.temForm.splice(key, 1); //删除对应key数组
          // Vue.delete(that.otherForm, item.key); //删除otherForm对应key值
          // Vue.delete(that.otherCheck, item.name); //删除otherCheck对应name值
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      //删除otherCheck对应name值
    },
    //logo联动
    logoMethods() {
      if (this.otherForm["705"] == "2") {
        this.logoInputShow = true;
      } else {
        this.logoInputShow = false;
      }
    },
    //项目背景图
    projectMethods() {
      if (this.otherForm["709"] == "2") {
        this.bgInputShow = true;
      } else {
        this.bgInputShow = false;
      }
    },
    QRcodeMethods() {
      if (this.otherForm["718"] == "2") {
        this.QRcodeInputShow = true;
      } else {
        this.QRcodeInputShow = false;
      }
    },
    //根据设备型号获取默认配置
    getConfigFormDoorType(code) {
      let that = this;
      if (code !== "7" && code !== "8") {
        getDefaultConfig({ doorType: code })
          .then(function (response) {
            if (response.data && response.data.code === 1) {
              let data = JSON.parse(response.data.data.configStr);
              that.faceForm = that.matchValue(data.face, that.faceForm);
              that.lightForm = that.matchValue(data.light, that.lightForm);
              that.soundForm = that.matchValue(data.sound, that.soundForm);
              that.otherForm = that.matchValue(data.undefined, that.otherForm);
              that.cameraForm = that.matchValue(data.camera, that.cameraForm);
              that.hardwareForm = that.matchValue(
                data.hardware,
                that.hardwareForm
              );
              that.temForm = data.temForm || []; //无数据则为空数组
              that.timeRange = that.lightForm["305"];

              if(code == "2"){
                that.soundForm['402'] = '0.2'
                that.soundForm['406'] = '0.2'
              }
            }
          })
          .finally(function (a) {});
      }
    },
    //重启策略和定期重启时间联动
    chgMethods() {
      this.otherForm["609"] = "";
      this.reStartTime = "";
      this.valid();
      // this.$refs['otherForm'].validate()
    },
    valid() {
      let that = this;
      if (that.otherForm["608"] == 0) {
        that.otherRule["609"][0].required = false;
        that.otherRule["609"][0].message = "";
        that.methodType = 0;
      } else if (that.otherForm["608"] == 1) {
        that.otherRule["609"][0].required = true;
        that.otherRule["609"][0].message = "请选择";
        that.methodType = 1;
      } else if (that.otherForm["608"] == 2) {
        that.otherRule["609"][0].required = true;
        that.otherRule["609"][0].message = "请选择";
        that.methodType = 2;
      }
    },
    // newArr为查询到的当前的配置，oldForm为默认的form值，此公共方法为配置赋值
    matchValue(newArr, oldForm) {
      let that = this;
      let obj = oldForm;

      newArr.forEach((item) => {
        // if (obj == that.otherForm) {
        //   //检测临时配置
        // if (!obj.hasOwnProperty(item.key)) {
        //   //不存在属性
        //   // console.log("不存在的属性",item.key);
        //   obj[item.key] = item.value;
        //   that.temList.push({
        //     name: item.name,
        //     value: item.value,
        //     key: item.key,
        //   });
        // }
        // }

        Object.keys(obj).forEach((key2) => {
          if (item.key == key2) {
            obj[key2] = item.value;
          }
        });
      });
      //重启策略为每周时特殊处理
      if (oldForm == that.otherForm) {
        if (that.otherForm["608"] == 2) {
          that.methodType = 2;
          let arr = that.otherForm["609"].split("|");
          that.otherForm["609"] = +arr[0];
          that.reStartTime = arr[1];
        }
        that.valid();
        // that.$refs['otherForm'].validate()
      }
      // if(oldForm == that.cameraForm){
      //   that.cameraForm['204'] = that.cameraForm['204'].toString()
      // }
      if (oldForm == that.faceForm) {
        that.faceForm["505"] = that.faceForm["505"].toString();
      }
      return obj;
    },
    //查询获取当前的设备配置
    searchSetting() {
      let that = this;
      configDetails({ configId: that.basicForm.configId })
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            let UndefinedArr = response.data.data.config.undefined;
            // console.log(response.data.data);
            UndefinedArr.forEach((item, i) => {
              if (item.name == "logo设置") {
                if (UndefinedArr[i].value == "0") {
                  that.otherForm["705"] = "0";
                  UndefinedArr[i].value = "0";
                  that.logoInputShow = false;
                } else if (UndefinedArr[i].value == "") {
                  that.otherForm["705"] = "1";
                  UndefinedArr[i].value = "1";
                  that.logoInputShow = false;
                } else {
                  that.logoInput = UndefinedArr[i].value;
                  that.otherForm["705"] = "2";
                  UndefinedArr[i].value = "2";
                  that.logoInputShow = true;
                }
              }

              if (item.name == "项目背景图") {
                if (UndefinedArr[i].value == "0") {
                  that.otherForm["709"] = "0";
                  UndefinedArr[i].value = "0";
                  that.bgInputShow = false;
                } else if (UndefinedArr[i].value == "") {
                  that.otherForm["709"] = "1";
                  UndefinedArr[i].value = "1";
                  that.bgInputShow = false;
                } else {
                  that.bgInput = UndefinedArr[i].value;
                  that.otherForm["709"] = "2";
                  UndefinedArr[i].value = "2";
                  that.bgInputShow = true;
                }
              }

              if (item.name == "二维码动态下发") {
                if (UndefinedArr[i].value == "0") {
                  that.otherForm["718"] = "0";
                  UndefinedArr[i].value = "0";
                  that.QRcodeInputShow = false;
                } else if (UndefinedArr[i].value == "") {
                  that.otherForm["718"] = "1";
                  UndefinedArr[i].value = "1";
                  that.QRcodeInputShow = false;
                } else {
                  that.bgInput = UndefinedArr[i].value;
                  that.otherForm["718"] = "2";
                  UndefinedArr[i].value = "2";
                  that.QRcodeInputShow = true;
                }
              }
            });

            let data = response.data.data.config;

            // console.log("接收的otherForm", data.undefined);

            that.faceForm = that.matchValue(data.face, that.faceForm);
            that.lightForm = that.matchValue(data.light, that.lightForm);
            that.soundForm = that.matchValue(data.sound, that.soundForm);
            that.otherForm = that.matchValue(data.undefined, that.otherForm);
            that.cameraForm = that.matchValue(data.camera, that.cameraForm);
            that.hardwareForm = that.matchValue(
              data.hardware,
              that.hardwareForm
            );
            that.temForm = data.temForm || [];
            that.timeRange = that.lightForm["305"];

            // console.log("接收处理后的otherForm", that.otherForm);
            // console.log("temList", that.temList);
          }
        })
        .finally(function (a) {});
    },
    //处理请求参数  form为各项配置的值，checkObj为每项配置中key与label对应
    dealParam(form, checkObj) {
      let arr = [];
      Object.keys(form).forEach((key1) => {
        Object.keys(checkObj).forEach((key2) => {
          if (checkObj[key2] == key1) {
            arr.push({
              name: key2,
              value: form[key1],
              key: +key1,
            });
          }
        });
      });
      //重启策略为每周时特殊处理
      if (form == this.otherForm) {
        if (this.methodType === 2) {
          arr.forEach((item) => {
            if (item.key == 609) {
              item.value = `${item.value}|${this.reStartTime}`;
            }
          });
        } else if (this.methodType === 1) {
          let str = this.otherForm["609"];
          this.otherForm["609"] = str.substring(str.length - 5);
          arr.forEach((item) => {
            if (item.key == 609) {
              item.value = `1|${this.otherForm["609"]}`;
            }
          });
        }
      }
      return arr;
    },
    //校验通过后保存
    clickSave() {
      this.$refs["basicForm"].validate((valid0) => {
        if (valid0) {
          this.$refs["hardwareForm"].validate((valid1) => {
            if (valid1) {
              this.$refs["cameraForm"].validate((valid2) => {
                if (valid2) {
                  this.$refs["lightForm"].validate((valid3) => {
                    if (valid3) {
                      this.$refs["soundForm"].validate((valid4) => {
                        if (valid4) {
                          this.$refs["faceForm"].validate((valid5) => {
                            if (valid5) {
                              this.$refs["otherForm"].validate((valid6) => {
                                if (valid6) {
                                  this.saveData();
                                } else {
                                  this.activeName = "six";
                                }
                              });
                            } else {
                              this.activeName = "five";
                            }
                          });
                        } else {
                          this.activeName = "four";
                        }
                      });
                    } else {
                      this.activeName = "three";
                    }
                  });
                } else {
                  this.activeName = "two";
                }
              });
            } else {
              this.activeName = "one";
            }
          });
        }
      });
    },
    //保存
    saveData() {
      let that = this;
      that.lightForm["305"] = that.timeRange;

      if (that.otherForm["705"] == "0") {
        that.otherForm["705"] = "0";
      } else if (that.otherForm["705"] == "1") {
        that.otherForm["705"] = "";
      } else if (that.otherForm["705"] == "2") {
        that.otherForm["705"] = that.logoInput;
      }

      if (that.otherForm["709"] == "0") {
        that.otherForm["709"] = "0";
      } else if (that.otherForm["709"] == "1") {
        that.otherForm["709"] = "";
      } else if (that.otherForm["709"] == "2") {
        that.otherForm["709"] = that.bgInput;
      }
      if (that.otherForm["718"] == "0") {
        that.otherForm["718"] = "0";
      } else if (that.otherForm["718"] == "1") {
        that.otherForm["718"] = "";
      } else if (that.otherForm["718"] == "2") {
        that.otherForm["718"] = that.QRcodeInput;
      }
      // console.log("发送前的underfined", this.otherForm, this.otherCheck);

      let obj = {
        face: this.dealParam(this.faceForm, this.faceCheck),
        light: this.dealParam(this.lightForm, this.lightCheck),
        sound: this.dealParam(this.soundForm, this.soundCheck),
        undefined: this.dealParam(this.otherForm, this.otherCheck),
        camera: this.dealParam(this.cameraForm, this.cameraCheck),
        hardware: this.dealParam(this.hardwareForm, this.hardwareCheck),
        temForm: this.temForm,
      };

      // console.log("处理后发送的underfined", obj.undefined);

      let data = {
        configId: this.basicForm.configId,
        communityId: this.basicForm.communityId,
        configName: this.basicForm.configName,
        doorType: this.basicForm.doorType,
        config: JSON.stringify(obj),
      };
      that.btnLoading = true;
      let api = null;
      if (this.type === "copy" || this.type === "add") {
        api = addConfig;
      } else if (this.type === "edit") {
        api = editConfig;
      }
      api(data)
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            that.btnLoading = false;
            that.$message({
              type: "success",
              message: response.data.message,
            });
            that.$router.back(-1);
            bus.$emit("success");
          }
        })
        .finally(function (a) {
          that.btnLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.device-config {
  .back,
  .back-icon {
    color: #007ee4 !important;
    font-size: 14px;
  }
  .back {
    cursor: pointer;
    margin-right: 10px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    color: #223040;
    line-height: 20px;
  }
  .backTop {
    min-width: 1000px;
    background: #fff;
    padding: 11px 20px 9px 20px;
    margin-bottom: 10px;
    overflow: hidden;
    span,
    label {
      line-height: 40px;
      float: left;
    }
    .weight {
      font-weight: 700;
      font-size: 14px;
    }
    .save-btn {
      float: right;
    }
  }
  .setting-detail {
    width: 100%;
    background: #fff;
    padding-top: 9px;
  }
  .congfigTop {
    padding: 10px 30px !important;
  }
}
.temContainer {
  display: flex;
  flex-wrap: wrap;
}
.temContainer-item {
  flex: 0 0 25%;
  margin-bottom: 20px;
}
.temContainer-item p {
  width: 209px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.temContainer-item /deep/.el-input {
  width: 209px;
}
.temContainer /deep/.el-dialog__body {
  padding: 38px 50px 30px;
}
.temContainer /deep/.el-dialog .el-input {
  width: 340px;
  height: 36px;
}
.temContainer /deep/.el-form-item--medium .el-form-item__label {
  line-height: 12px;
  padding-bottom: 10px;
}
.temContainer /deep/.form-dialog-control-area {
  border-top: 0px solid #ebebeb;
  padding: 20px 20px 0 0;
  text-align: center;
}
.temContainer /deep/.form-dialog-control-area .el-button--medium {
  width: 90px;
  height: 36px;
}

.temContainer /deep/.el-button--medium {
  padding: 11px;
  font-size: 12px;
  border-radius: 4px;
}
.temContainer /deep/.el-button--danger {
  color: rgba(247, 103, 99, 1);
  background-color: rgba(247, 103, 99, 0.1);
  border: none;
  // opacity: 0.1;
}
</style>
<style>
.JDdeviceConfig .el-form--inline .el-form-item__label {
  display: block !important;
  text-align: left !important;
}
.JDdeviceConfig .el-tabs__content {
  padding: 20px 30px !important;
}
.JDdeviceConfig .el-form-item__content {
  width: auto;
}
.JDdeviceConfig .longLabel .el-form-item__label {
  line-height: 16px !important;
}
.JDdeviceConfig .formatTime {
  width: 200px !important;
}
.JDdeviceConfig .el-tabs__nav-scroll {
  padding: 10px 30px 0px 30px !important;
}
</style>
<style>
/* element样式重置 start */
/* 去掉input尾部上下小箭头 start */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  -o-appearance: none !important;
  -ms-appearance: none !important;
  appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  -o-appearance: textfield;
  -ms-appearance: textfield;
  appearance: textfield;
}
/* 去掉input尾部上下小箭头 end */
</style>