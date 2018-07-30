import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';

// Actions

const addExpense = (
    {
        description = '',
        note = '',
        amount = 0,
        createdAt = 0
    } = {}
) => ({
    type: 'ADD_EXPENSE',
    expense: {
        id: uuid(),
        description: description,
        note: note,
        amount: amount,
        createdAt: createdAt
    }
});

const removeExpense = ({ id }) => ({
    type: 'REMOVE_EXPENSE',
    id: id
});

const editExpense = (id, updates) => ({
    type: 'EDIT_EXPENSE',
    id: id,
    updates: updates
});

const setTextFilter = (text = '') => ({
    type: 'SET_TEXT_FILTER',
    text: text
});

const sortByAmount = () => ({
    type: 'SORT_BY_AMOUNT',
});

const sortByDate = () => ({
    type: 'SORT_BY_DATE',
});

const setStartDate = (startDate) => ({
    type: 'SET_START_DATE',
    startDate
});

const setEndDate = (endDate) => ({
    type: 'SET_END_DATE',
    endDate
});

// AddExpense, RemoveExpense,EditExpense
// SetTextFilter, SortByDate, SortByAmount, Set StartDate, Set EndDate

// Expenses Reducer

const expensesReducerDefaultState = [];

const expensesReducer = (state = expensesReducerDefaultState, action) => {
    switch (action.type) {
        case 'ADD_EXPENSE': {
            return [
                ...state,
                action.expense
            ];
        }
        case 'REMOVE_EXPENSE': {
                return state.filter(({ id }) => id !== action.id);
        }
        case 'EDIT_EXPENSE': {
            return state.map((expense) => {
                if(expense.id === action.id) {
                    return {
                        ...expense,
                        ...action.updates
                    };
                } else {
                    return expense;
                }
            });
        }
        default: {
            return state;
        }
    }
};

// Filters Reducer

const filtersReducerDefaultState = {
    text: '',
    sortBy: 'date',
    startDate: undefined,
    endDate: undefined
};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_TEXT_FILTER': {
            return {
                ...state,
                text: action.text
            };
        }
        case 'SORT_BY_AMOUNT': {
            return {
                ...state,
                sortBy: 'amount'
            };
        }
        case 'SORT_BY_DATE': {
            return {
                ...state,
                sortBy: 'date'
            };
        }
        case 'SET_START_DATE': {
            return {
                ...state,
                startDate: action.startDate
            };
        }
        case 'SET_END_DATE': {
            return {
                ...state,
                endDate: action.endDate
            };
        }
        default: {
            return state;
        }
    }
};

// GET visible expenses

const getVisibleExpences = (expenses, { text, sortBy, startDate, endDate }) => {
    return expenses.filter((expense) => {
        const startDateMatch = typeof startDate !== 'number' || expense.createdAt >= startDate;
        const endDateMatch = typeof endDate !== 'number' || expense.createdAt <= endDate;
        const textMatch = typeof text !== 'string' && typeof expense.description !== 'string' ||  expense.description.toLowerCase().includes(text.toLowerCase());
        return startDateMatch && endDateMatch && textMatch;
    }).sort((a,b) => {
        if (sortBy === 'date') {
            return a.createdAt < b.createdAt ? 1 : -1;
        } else if (sortBy === 'amount') {
            return a.amount < b.amount ? 1 : -1;
        }
    });
};

// Store Creation

const store = createStore(
    combineReducers({
        expenses: expensesReducer,
        filters: filtersReducer
    })
);

store.subscribe(() => {
    const state = store.getState();
    const visibleExpenses = getVisibleExpences(state.expenses, state.filters);
    console.log(visibleExpenses);
});

const expenseOne = store.dispatch(addExpense({ description: 'rent', amount: 100, createdAt: -200 }));
const expenseTwo = store.dispatch(addExpense({ description: 'coffee', amount: 200, createdAt: 100 }));

// store.dispatch(removeExpense({ id: expenseOne.expense.id }));

// store.dispatch(editExpense(expenseTwo.expense.id, { amount: 500 }));

// store.dispatch(setTextFilter('rent'));
// store.dispatch(setTextFilter());

store.dispatch(sortByAmount());
// store.dispatch(sortByDate());

// store.dispatch(setStartDate(0));
// store.dispatch(setStartDate());
// store.dispatch(setEndDate(999));

// The State that we want

const demoState = {
    expenses: [{
        id: 'asdfasdf',
        description: 'January Rent',
        note: 'This was the final payment for that address',
        amount: 54500,
        createdAt: 0
    }],
    filters: {
        text: 'rent',
        sortBy: 'amount', // date or amount
        startDate: undefined,
        endDate: undefined
    }
};