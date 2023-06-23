import React, { useState } from 'react'
import TopAlignedLabelAndInput from './TopAlignedLabelAndInput'

const DynamicExpressionInputComponent = () => {
  const [dynamicExpressions, setDynamicExpressions] = useState([
    { expression: '' },
  ])

  const handleAddButtonPressed = () => {
    setDynamicExpressions([...dynamicExpressions, { expression: '' }])
  }

  const handleDeleteButtonPressed = (index: number) => {
    const updatedExpressions = [...dynamicExpressions]
    updatedExpressions.splice(index, 1)
    setDynamicExpressions(updatedExpressions)
  }

  const handleDynamicExpressionChange = (index: number, value: string) => {
    const updatedExpressions = [...dynamicExpressions]
    updatedExpressions[index].expression = value
    setDynamicExpressions(updatedExpressions)
  }

  return (
    <>
      <div className="mt-4">
        <h2 className="flex items-center w-full p-2 text-gray-500 text-left border border-gray-200 bg-gray-100">
          Dynamic Response Configuration
          <button
            className="px-6 py-2 h-auto ml-auto mr-1 self-center rounded-sm font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            onClick={handleAddButtonPressed}
          >
            Add Expression
          </button>
        </h2>
        <div className="p-4 border border-gray-200 focus:ring-blue-600">
          <div className="grid grid-cols-2 gap-4">
            {dynamicExpressions.map((dynamicExpression, index) => (
              <div className="flex">
                <div className="w-4/5">
                  <TopAlignedLabelAndInput
                    htmlInputId={`inputDynamicExpression ${index}`}
                    label={`Expression ${index + 1}`}
                    value={dynamicExpression.expression}
                    placeholder="Write your expression here"
                    type="number"
                    divClassAppend="my-2"
                    onChange={(e) =>
                      handleDynamicExpressionChange(index, e.target.value)
                    }
                  />
                </div>
                <div className="w-1/5">
                  <button
                    className="px-6 py-2 mt-6 ml-4 h-auto ml-auto mr-1 self-center rounded-sm font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => handleDeleteButtonPressed(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default DynamicExpressionInputComponent