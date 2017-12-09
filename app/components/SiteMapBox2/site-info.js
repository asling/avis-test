/**
 * 
 */
import React, {PureComponent} from 'react';

export default class SiteInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.siteid}, ${info.sitename} ${info.regionName}`;

    return (
      <div>
        <div>
          {displayName}
        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}