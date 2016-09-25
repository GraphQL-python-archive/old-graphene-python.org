import React from 'react';

import Icon from 'assets/icon'
import logo from '!raw!assets/logo.svg'

const Logo = ({className}) =>
	<span className="graphene-logo">
		<Icon src={logo} />
        Graphene
    </span>

export default Logo;
