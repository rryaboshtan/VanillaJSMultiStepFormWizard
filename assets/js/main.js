class MyWizard {
    constructor(containerElement, steps, options = {}) {
        this.containerElement = containerElement
        this.steps = steps
        this.options = Object.assign({
            stepsSelector: '.steps',
            nextButtonSelector: '.next-btn',
            activeStepId: 1,
        }, options)
        this.Status = {
            Active: 1,
            Inactive: 2,
            Done: 3
        }
        Object.freeze(this.Status)
        this.init()
    }

    init() {
        this.initStatuses()
        this.renderSteps()
        this.initNextButtonClick()
        this.visibilityForFormById(this.options.activeStepId, true)
    }

    initStatuses() {
        let hasActiveStep = false;

        this.steps.forEach(step => {
            if (step.Id === this.options.activeStepId) {
                step.Status = this.Status.Active
                hasActiveStep = true
            } else if (hasActiveStep) {
                step.Status = this.Status.Inactive
            } else
                step.Status = this.Status.Done
        });
    }

    renderSteps() {
        const result = this.steps.map(step => {
            const className = this.getClassName(step.Status)
            const item = `
            <div class = "step ${className}" data-step-id="${step.Id}">
                <div class="step__header">${step.Header}</div>
                <div class="step__point">
                    <div class="point"></div>
                    <div class="post-line">
                        <div class="post-line__filler"></div>
                    </div>
                </div>
            </div>`
            return item
        })
        this.containerElement.querySelector(this.options.stepsSelector).innerHTML = result.join('')
    }


    initNextButtonClick() {
        const nextButton = this.containerElement.querySelector(this.options.nextButtonSelector)
        nextButton.addEventListener('click', () => {
            this.nextStep()
        })
    }

    visibilityForFormById(currentStepId, isVisible) {
        const selector = `.form[data-form-id="${currentStepId}"]`
        const form = this.containerElement.querySelector(selector)
        if (isVisible) {
            form.classList.add('active')
        } else {
            form.classList.remove('active')
        }
        const submitButton = this.containerElement.querySelector(this.options.nextButtonSelector)
        if (currentStepId === this.steps.length) {
            submitButton.innerHTML = 'Submit'
        }
    }

    nextStep() {
        let currentIndex = this.steps.findIndex(el => el.Status == this.Status.Active)

        if (currentIndex === -1) {
            return
        }
        let currentStepId = this.steps[currentIndex].Id

        if (this.validForm(currentStepId)) {
            this.steps[currentIndex].Status = this.Status.Done
            this.updateStep(this.steps[currentIndex])

            if (currentIndex < this.steps.length - 1) {
                this.visibilityForFormById(currentStepId, false)
                ++currentIndex
                currentStepId = this.steps[currentIndex].Id
                this.steps[currentIndex].Status = this.Status.Active
                this.updateStep(this.steps[currentIndex])

                this.visibilityForFormById(currentStepId, true)
            }
        }
    }

    updateStep(step) {
        const stepContainer = this.containerElement.querySelector(`.step[data-step-id="${step.Id}"]`)
        const className = this.getClassName(step.Status)

        stepContainer.classList.forEach(el => {
            if (el !== 'step') {
                stepContainer.classList.remove(el)
            }
        })
        stepContainer.classList.add(className)
    }

    validForm(currentStepId) {
        let valid = true
        const selector = `.form[data-form-id="${currentStepId}"] input`
        const inputs = document.querySelectorAll(selector)

        inputs.forEach(input => {
            if (input.validity.valid === false) {
                valid = false
            }
        })
        const errorMsg = document.querySelector('.error-msg')

        if (valid === false) {
            errorMsg.style.display = 'block'
        } else {
            errorMsg.style.display = 'none'
        }
        return valid
    }

    getClassName(status) {
        let result = ''
        switch (status) {
            case this.Status.Active:
                result = 'active'
                break
            case this.Status.Done:
                result = 'done'
                break
            case this.Status.Inactive:
                result = 'inactive'
        }
        return result
    }
}

const steps = [
    {
        Id: 1,
        Header: 'Profile',
    },
    {
        Id: 2,
        Header: 'Social medias',
    },
    {
        Id: 3,
        Header: 'Additional info',
    },
]

const wizardContainer = document.querySelector('.steps__container')
const wizard = new MyWizard(wizardContainer, steps, { activeStepId: 1 })