import React from 'react';
import debounce from "./debounce";

const limit_options = {
  0: 10,
  1: 20,
  2: 50
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input_value: "",
      limit: 10,
      loading: false,
      search_result: [],
      search_result_sliced: [],
      error: ""
    }

    this.input_ref = React.createRef();

    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.fetchCountries = debounce(this.fetchCountries, 500);
  }

  componentDidMount() {
    this.input_ref.current.focus();
  }

  fetchCountries(query) {
    this.setState({
      error: ""
    })

    fetch("https://restcountries.eu/rest/v2/all")
      .then(response => {
        if (response.status === 200) {
          response.json()
            .then(result => {
              const filter_result = this.filterResult(result, query);

              this.setState({
                search_result: filter_result,
                search_result_sliced: filter_result.slice(0, this.state.limit),
                loading: false
              })
            })
        } else {
          this.setState({
            loading: false,
            error: `Произошла ошибка! Код ответа: ${response.status}`
          })
        }
      })
  }

  filterResult(list, query) {
    const filtered = [];

    query = query.toLowerCase();

    for (let i = 0; i < list.length; i++) {
      const country_name_lower = list[i].name.toLowerCase(),
            search_i = country_name_lower.indexOf(query);
      
      if (search_i !== -1) {
        // Если совпало начало слова - добавляем в начало выдачи
        if (search_i === 0) {
          filtered.unshift(list[i].name);
        } else {
          filtered.push(list[i].name);
        }
      }
    }

    return filtered;
  }

  onInputChange(e) {
    const new_val = e.target.value;

    this.setState({
      input_value: new_val
    })
    
    if (new_val.length) {
      this.setState({
        loading: true
      })

      this.fetchCountries(new_val);
    }
  }

  onSelectChange(e) {
    this.setState({
      limit: limit_options[e.target.value],
      search_result_sliced: this.state.search_result.slice(0, limit_options[e.target.value])
    })
  }

  render() {
    let search_result;

    if (this.state.error) {
      search_result = (
        <div className="search_error">{this.state.error}</div>
      )
    } else {
      search_result = this.state.search_result_sliced.map(name => {
        return (
          <div className="country_name" key={name}>
            {name}
          </div>
        )
      })
    }

    return (
      <div className="App">
        <input
          id="main-input"
          type="text"
          value={this.state.input_value}
          ref={this.input_ref}
          onChange={this.onInputChange}
        />
        <div className="limit-select-container">
          <span className="limit-select-text">Показывать: </span>
          <select onChange={this.onSelectChange}>
            <option value="0">10</option>
            <option value="1">20</option>
            <option value="2">50</option>
          </select>
        </div>
        <div className="search-result">
          {
            this.state.loading
            ? <div className="spinner" />
            : search_result
          }
        </div>
      </div>
    );
  }
}

export default App;
