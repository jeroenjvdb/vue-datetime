import { DateTime as LuxonDateTime } from 'luxon'
import Datetime from 'src/Datetime.vue'
import { createVM } from '../helpers/utils.js'

describe('Datetime.vue', function () {
  describe('render', function () {
    it('should add class to wrapper', function () {
      const vm = createVM(this,
        `<Datetime wrapper-class="class-name"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime')).to.have.class('class-name')
    })

    it('should print an input text', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.match('input')
    })

    it('should add class to input', function () {
      const vm = createVM(this,
        `<Datetime input-class="class-name"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.class('class-name')
    })

    it('input should inherit attributes', function () {
      const vm = createVM(this,
        `<Datetime placeholder="Select date..."></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.attr('placeholder', 'Select date...')
    })

    it('input should inherit events', function () {
      const vm = createVM(this,
        `<Datetime @click="spy"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called
      vm.$('.vdatetime-input').click()
      expect(vm.spy).to.have.been.calledOnce
    })
  })

  describe('types', function () {
    it('should be date by default', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar')).to.exist
      })
    })

    it('should be datetime', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--confirm').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-time-picker')).to.exist
          done()
        })
      })
    })
  })

  describe('value', function () {
    it('should be null when value is empty', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.datetime).null
    })

    it('should be null when value is not valid', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-32T19:34:54.078Z'
            }
          }
        })

      expect(vm.datetime).null
    })

    it('should be a UTC time by default', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-07T16:34:54.078Z')
    })

    it('should be a time in a specified time zone', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" value-zone="UTC-04:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-07T12:34:54.078-04:00')
    })
  })

  describe('input value', function () {
    it('should be empty when value is empty', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.empty
    })

    it('should be empty when value is not valid', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-32T19:34:54.078Z'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.empty
    })

    it('should be a localized date in a local time zone by default', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017, 5:34 PM')
    })

    it('should be a localized date in a specified time zone', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" zone="UTC+04:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017, 8:34 PM')
    })

    it('should be a localized datetime in a specified time zone when is datetime', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+04:00" type="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017, 8:34 PM')
    })

    it('should be formatted with specified format', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC" :format="format"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: LuxonDateTime.DATE_HUGE
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Thursday, December 7, 2017')
    })
  })

  describe('popup', function () {
    it('should open when clicking input', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-overlay')).to.exist
        expect(vm.$('.vdatetime-popup')).to.exist
        done()
      })
    })

    it('should open when focusing input', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').focus()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-overlay')).to.exist
        expect(vm.$('.vdatetime-popup')).to.exist
        done()
      })
    })

    it('should close when clicking overlay', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-overlay').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })
  })

  describe('events', function () {
    it('should update value and close popup on confirm ', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T05:22:00.123Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[23].click()
        vm.$('.vdatetime-popup__actions__button--confirm').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 20, 2020')
          expect(vm.datetime).to.be.equal('2020-05-20T05:22:00.123Z')
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })

    it('should not update value and close popup on cancel', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T05:22:00.123Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[21].click()
        vm.$('.vdatetime-popup__actions__button--cancel').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 7, 2020')
          expect(vm.datetime).to.be.equal('2020-05-07T05:22:00.123Z')
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })
  })
})