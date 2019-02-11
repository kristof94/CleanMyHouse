<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">default header</slot>
          </div>
          <div class="modal-body">
            <div class="check_mark">
              <div class="sa-icon sa-success">
                <span class="sa-line sa-tip"/>
                <span class="sa-line sa-long"/>
                <div class="sa-placeholder"/>
                <div class="sa-fix"/>
              </div>
            </div>
            <slot name="body">default body</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="close">Continuer</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.sa-icon {
  width: 80px;
  height: 80px;
  /*border: 4px solid gray;*/
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  margin: 20px auto;
  padding: 0;
  position: relative;
  box-sizing: content-box;
}

.sa-icon.sa-success {
  border-color: #dd0012;
}

.sa-icon.sa-success::before,
.sa-icon.sa-success::after {
  content: '';
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  position: absolute;
  width: 0px;
  height: 120px;
  background: white;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success::before {
  -webkit-border-radius: 120px 0 0 120px;
  border-radius: 120px 0 0 120px;
  top: -7px;
  left: -33px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 60px 60px;
  transform-origin: 60px 60px;
}

.sa-icon.sa-success::after {
  -webkit-border-radius: 0 120px 120px 0;
  border-radius: 0 120px 120px 0;
  top: -11px;
  left: 30px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 0px 60px;
  transform-origin: 0px 60px;
}

.sa-icon.sa-success .sa-placeholder {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(138, 22, 22, 0.5);
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  left: -4px;
  top: -5px;
  z-index: 2;
}

.sa-icon.sa-success .sa-fix {
  width: 5px;
  height: 90px;
  background-color: white;
  position: absolute;
  left: 28px;
  top: 8px;
  z-index: -1;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.sa-icon.sa-success {
  border-color: transparent\9;
}
.sa-icon.sa-success .sa-line.sa-tip {
  -ms-transform: rotate(45deg) \9;
}
.sa-icon.sa-success .sa-line.sa-long {
  -ms-transform: rotate(-45deg) \9;
}

.sa-icon.sa-success .sa-line {
  height: 5px;
  background-color: #dd0012;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 2;
}

.sa-icon.sa-success .sa-line.sa-tip {
  width: 60px;
  left: 11px;
  top: 37px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success .sa-line.sa-long {
  width: 60px;
  right: 11px;
  top: 37px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
</style>
