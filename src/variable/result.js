export const resultInfo = {
  "NUMBER": {
    "11": {
      "template": "x=${0},y=${1}"
    },
    "12": {
      "template": "r=${0},θ=${1}"
    },
    "13": {
      "template": "${2}=${0},L-R=${1}"
    },
    "14": {
      "template": "a=${0},R=${1}"
    },
    "15": {
      "template": "F=${1},a=${0}"
    }
  },
  "INEQUALITY": {
    "01": {
      "name": {
        "en": "All Real Numbers",
        "zh": "所有实数",
        "vi": "Tất cả số thực"
      }
    },
    "02": {
      "name": {
        "en": "No Solution",
        "zh": "无解",
        "vi": "Vô nghiệm"
      }
    },
    "03": {
      "template": "x=${0}"
    },
    "04": {
      "template": "x≠${0}"
    },
    "05": {
      "template": "x<${0}"
    },
    "06": {
      "template": "x≤${0}"
    },
    "07": {
      "template": "${0}<x"
    },
    "08": {
      "template": "${0}≤x"
    },
    "09": {
      "template": "${0}<x<${1}"
    },
    "0A": {
      "template": "${0}≤x≤${1}"
    },
    "0B": {
      "template": "x<${0}, ${1}<x"
    },
    "0C": {
      "template": "x≤${0}, ${1}≤x"
    },
    "0D": {
      "template": "x=${0}, ${1}≤x"
    },
    "0E": {
      "template": "x≠${0} \\mathrm{and} x<${1}"
    },
    "0F": {
      "template": "x≤${0}, x=${1}"
    },
    "10": {
      "template": "${0}<x \\mathrm{and} x ≠${1}"
    },
    "11": {
      "template": "${0}<x<${1}, ${2}<x"
    },
    "12": {
      "template": "${0}≤x≤${1}, ${2}≤x"
    },
    "13": {
      "template": "x<${0}, ${1}<x<${2}"
    },
    "14": {
      "template": "x≤${0}, ${1}≤x≤${2}"
    },
    "15": {
      "template": "x≠${0} \\mathrm{and} x≠${1}"
    },
    "16": {
      "template": "x=${0}, x=${1}"
    },
    "17": {
      "template": "x≠${0} \\mathrm{and} x<${1}, ${2}<x"
    },
    "18": {
      "template": "x=${0}, ${1}≤x≤${2}"
    },
    "19": {
      "template": "${0}<x<${2} \\mathrm{and} x≠${1}"
    },
    "1A": {
      "template": "x≤${0}, x=${1}, ${2}≤x"
    },
    "1B": {
      "template": "x<${0}, ${1}<x, \\mathrm{and} x≠${2}"
    },
    "1C": {
      "template": "${0}≤x≤${1}, x=${2}"
    },
    "1D": {
      "template": "${0}<x<${1}, ${2}<x<${3}"
    },
    "1E": {
      "template": "x<${0}, ${1}<x<${2}, ${3}<x"
    },
    "1F": {
      "template": "${0}≤x≤${1}, ${2}≤x≤${3}"
    },
    "20": {
      "template": "x≤${0}, ${1}≤x≤${2}, ${3}≤x"
    }
  },
  "EQUATION": {
    "0": {
      "01": {
        "template": "x=${0}\\\\y=${1}"
      },
      "02": {
        "template": "x=${0}\\\\y=${1}\\\\z=${2}"
      },
      "03": {
        "template": "x=${0}\\\\y=${1}\\\\z=${2}\\\\t=${3}"
      },
      "04": {
        "2": {
          "template": "x=${0}"
        },
        "4": {
          "template": "x_1=${0}\\\\x_2=${1}"
        },
        "6": {
          "template": "x=${0}\\\\x_{${EXT}}=${1}\\\\y_{${EXT}}=${2}"
        },
        "8": {
          "template": "x_1=${0}\\\\x_2=${1}\\\\x_{${EXT}}=${2}\\\\y_{${EXT}}=${3}"
        }
      },
      "05": {
        "2": {
          "complexSetting": false,
          "template": "x=${0}"
        },
        "4": {
          "complexSetting": false,
          "template": "x_1=${0}\\\\x_2=${1}"
        },
        "6": {
          "complexSetting": true,
          "template": {
            "0": "x=${0}\\\\x_{max}=${1}\\\\y_{max}=${2}\\\\x_{min}=${3}\\\\y_{min}=${4}",
            "1": "x_1=${0}\\\\x_2=${1}\\\\x_3=${2}"
          }
        },
        "8": {
          "complexSetting": false,
          "template": "x_1=${0}\\\\x_2=${1}\\\\x_{max}=${2}\\\\y_{max}=${3}\\\\x_{min}=${4}\\\\y_{min}=${5}"
        },
        "10": {
          "complexSetting": false,
          "template": "x_1=${0}\\\\x_2=${1}\\\\x_3=${2}\\\\x_{max}=${3}\\\\y_{max}=${4}\\\\x_{min}=${5}\\\\y_{min}=${6}"
        }
      },
      "06": {
        "2": {
          "template": "x=${0}"
        },
        "4": {
          "template": "x_1=${0}\\\\x_2=${1}"
        },
        "6": {
          "template": "x_1=${0}\\\\x_2=${1}\\\\x_3=${2}"
        },
        "8": {
          "template": "x_1=${0}\\\\x_2=${1}\\\\x_3=${2}\\\\x_4=${3}"
        }
      }
    },
    "1": {
      "name": {
        "en": "Infinite Solution",
        "zh": "无数解",
        "vi": "Vô số nghiệm"
      }
    },
    "2": {
      "name": {
        "en": "No Solution",
        "zh": "无解",
        "vi": "Vô nghiệm"
      }
    },
    "4": {
      "name": {
        "en": "No Real Roots",
        "zh": "无实根",
        "vi": "Vô nghiệm"
      }
    },
    "5": {
      "name": {
        "en": "No Local Max/Min",
        "zh": "无极值",
        "vi": "Không có CĐ/CT"
      }
    }
  },
  "STATISTICS": {
    "ONE-VAR": {
      "template": "\\bar{x}=${0} \\\\ \\rm{\\Sigma}x=${1} \\\\ \\rm{\\Sigma}x^2=${2} \\\\ \\rm{\\sigma}^2x=${3} \\\\ \\rm{\\sigma}x=${4} \\\\ \\rm{s}^2x=${5} \\\\ \\rm{s}x=${6} \\\\ n=${7} \\\\ \\rm{min}(x)=${8} \\\\ \\rm{Q}_{1}=${9} \\\\ \\rm{Med}=${10} \\\\ \\rm{Q}_3=${11} \\\\ \\rm{max}(x)=${12}"
    },
    "TWO-VAR": {
      "template": "\\bar{x}=${0} \\\\ \\rm{\\Sigma}x=${1} \\\\ \\rm{\\Sigma}x^2=${2} \\\\ \\rm{\\sigma}^2x=${3} \\\\ \\rm{\\sigma}x=${4} \\\\ \\rm{s}^2x=${5} \\\\ \\rm{s}x=${6} \\\\ n=${7} \\\\ \\bar{y}=${8} \\\\ \\rm{\\Sigma}y=${9} \\\\ \\rm{\\Sigma}y^2=${10} \\\\ \\rm{\\sigma}^2y=${11} \\\\ \\rm{\\sigma}y=${12} \\\\ \\rm{s}^2y=${13} \\\\ \\rm{s}y=${14} \\\\ \\rm{\\Sigma}xy=${15} \\\\ \\rm{\\Sigma}x^3=${16} \\\\ \\rm{\\Sigma}x^2y=${17} \\\\ \\rm{\\Sigma}x^4=${18} \\\\ \\rm{min}(x)=${19} \\\\ \\rm{max}(x)=${20} \\\\ \\rm{min}(y)=${21} \\\\ \\rm{max}(y)=${22}"
    }
  }
}