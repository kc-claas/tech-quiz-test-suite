import Quiz from '../../client/src/components/Quiz'


describe('<Quiz>', ()=> {

    beforeEach(()=>
        cy.fixture('questions.json').then((fixture)=>{
            cy.intercept('GET', '/api/questions/random', fixture).as('questionsArray')
        })
    )

    it('should render the Quiz component', ()=> {
        cy.mount(<Quiz/>)
    })


    it('should display display a Start Quiz button if the quiz has not been started', ()=> {
        cy.mount(<Quiz/>)
        cy.get('button').should('have.text', 'Start Quiz')
    })

    it('should display the first question and answer set when the Start Quiz button is clicked', ()=> {
        cy.mount(<Quiz/>)
        cy.get('button').click()
        cy.wait('@questionsArray')
        cy.get('h2').should('have.text', 'Test question 1')
        cy.get('.card').children().eq(1).children().eq(2).children().eq(1).should('have.text', 'Wrong answer 1b')
    })

    it('should advance to displaying the next question when the previous is answered', ()=> {
        cy.mount(<Quiz/>)
        cy.get('button').click()
        cy.wait('@questionsArray')
        cy.get('h2').should('have.text', 'Test question 1')
        cy.get('button').first().click()
        cy.get('h2').should('have.text', 'Test question 2')
    })

    it('should display correct test results and a button to take a new quiz after the final question is answered', ()=> {
        cy.mount(<Quiz/>)
        cy.get('button').click()
        cy.wait('@questionsArray')
        cy.get('button').first().click()
        cy.get('button').first().click()
        cy.get('button').first().click()
        cy.get('h2').should('have.text', 'Quiz Completed')
        cy.get('.alert-success').should('have.text', 'Your score: 0/3')
        cy.get('button').should('have.text', 'Take New Quiz').click()
        cy.wait('@questionsArray')
        cy.get('button').eq(1).click()
        cy.get('button').eq(3).click()
        cy.get('button').eq(2).click()
        cy.get('.alert-success').should('have.text', 'Your score: 3/3')        
        

    })
})