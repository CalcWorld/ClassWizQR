import { tt } from '../utils.js';

export const inputInfo = {
  "EQUATION": {
    "01": {
      "template": "\\left\\{\\begin{array}{l}${0}x${1}y=${2}\\\\${3}x${4}y=${5}\\end{array}\\right.",
      "omitPlus": [0, 2, 3, 5],
      "coefficient": [2, 3],
    },
    "02": {
      "template": "\\left\\{\\begin{array}{l}${0}x${1}y${2}z=${3}\\\\${4}x${5}y${6}z=${7}\\\\${8}x${9}y${10}z=${11}\\end{array}\\right.",
      "omitPlus": [0, 3, 4, 7, 8, 11],
      "coefficient": [3, 4],
    },
    "03": {
      "template": "\\left\\{\\begin{array}{l}${0}x${1}y${2}z${3}t=${4}\\\\${5}x${6}y${7}z${8}t=${9}\\\\${10}x${11}y${12}z${13}t=${14}\\\\${15}x${16}y${17}z${18}t=${19}\\end{array}\\right.",
      "omitPlus": [0, 4, 5, 9, 10, 14, 15, 19],
      "coefficient": [4, 5],
    },
    "04": {
      "template": "${0}x^2${1}x${2}=0",
      "omitPlus": [0],
      "coefficient": [1, 3],
    },
    "05": {
      "template": "${0}x^3${1}x^2${2}x${3}=0",
      "omitPlus": [0],
      "coefficient": [1, 4],
    },
    "06": {
      "template": "${0}x^4${1}x^3${2}x^2${3}x${4}=0",
      "omitPlus": [0],
      "coefficient": [1, 5],
    }
  },
  "RATIO": {
    "01": {
      "template": "${0}:${1}=X:${2}",
    },
    "02": {
      "template": "${0}:${1}=${2}:X",
    }
  },
  "INEQUALITY": {
    "0400": {
      "template": "${0}x^2${1}x${2}>0"
    },
    "0401": {
      "template": "${0}x^2${1}x${2}<0"
    },
    "0402": {
      "template": "${0}x^2${1}x${2}≥0"
    },
    "0403": {
      "template": "${0}x^2${1}x${2}≤0"
    },
    "0500": {
      "template": "${0}x^3${1}x^2${2}x${3}>0"
    },
    "0501": {
      "template": "${0}x^3${1}x^2${2}x${3}<0"
    },
    "0502": {
      "template": "${0}x^3${1}x^2${2}x${3}≥0"
    },
    "0503": {
      "template": "${0}x^3${1}x^2${2}x${3}≤0"
    },
    "0600": {
      "template": "${0}x^4${1}x^3${2}x^2${3}x${4}>0"
    },
    "0601": {
      "template": "${0}x^4${1}x^3${2}x^2${3}x${4}<0"
    },
    "0602": {
      "template": "${0}x^4${1}x^3${2}x^2${3}x${4}≥0"
    },
    "0603": {
      "template": "${0}x^4${1}x^3${2}x^2${3}x${4}≤0"
    }
  },
  "DISTRIBUTION": {
    "01": {
      "3": {
        "template": "x=${0} \\\\ μ=${1} \\\\ σ=${2}"
      }
    },
    "02": {
      "4": {
        "template": () => tt('input.DISTRIBUTION.024'),
      }
    },
    "03": {
      "3": {
        "template": () => tt('input.DISTRIBUTION.033'),
      }
    },
    "04": {
      "2": {
        "template": "N=${0} \\\\ p=${1}"
      },
      "3": {
        "template": "x=${0} \\\\ N=${1} \\\\ p=${2}"
      }
    },
    "05": {
      "2": {
        "template": "N=${0} \\\\ p=${1}"
      },
      "3": {
        "template": "x=${0} \\\\ N=${1} \\\\ p=${2}"
      }
    },
    "06": {
      "1": {
        "template": "λ=${0}"
      },
      "2": {
        "template": "x=${0} \\\\ λ=${1}"
      }
    },
    "07": {
      "1": {
        "template": "λ=${0}"
      },
      "2": {
        "template": "x=${0} \\\\ λ=${1}"
      }
    }
  }
}