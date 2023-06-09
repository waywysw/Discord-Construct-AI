export const regions = [
    { geography: 'Africa', region: 'South Africa North', identifier: 'southafricanorth' },
    { geography: 'Asia Pacific', region: 'East Asia', identifier: 'eastasia' },
    { geography: 'Asia Pacific', region: 'Southeast Asia', identifier: 'southeastasia' },
    { geography: 'Asia Pacific', region: 'Australia East', identifier: 'australiaeast' },
    { geography: 'Asia Pacific', region: 'Central India', identifier: 'centralindia' },
    { geography: 'Asia Pacific', region: 'Japan East', identifier: 'japaneast' },
    { geography: 'Asia Pacific', region: 'Japan West', identifier: 'japanwest' },
    { geography: 'Asia Pacific', region: 'Korea Central', identifier: 'koreacentral' },
    { geography: 'Canada', region: 'Canada Central', identifier: 'canadacentral' },
    { geography: 'Europe', region: 'North Europe', identifier: 'northeurope' },
    { geography: 'Europe', region: 'West Europe', identifier: 'westeurope' },
    { geography: 'Europe', region: 'France Central', identifier: 'francecentral' },
    { geography: 'Europe', region: 'Germany West Central', identifier: 'germanywestcentral' },
    { geography: 'Europe', region: 'Norway East', identifier: 'norwayeast' },
    { geography: 'Europe', region: 'Switzerland North', identifier: 'switzerlandnorth' },
    { geography: 'Europe', region: 'Switzerland West', identifier: 'switzerlandwest' },
    { geography: 'Europe', region: 'UK South', identifier: 'uksouth' },
    { geography: 'Middle East', region: 'UAE North', identifier: 'uaenorth' },
    { geography: 'South America', region: 'Brazil South', identifier: 'brazilsouth' },
    { geography: 'US', region: 'Central US', identifier: 'centralus' },
    { geography: 'US', region: 'East US', identifier: 'eastus' },
    { geography: 'US', region: 'East US 2', identifier: 'eastus2' },
    { geography: 'US', region: 'North Central US', identifier: 'northcentralus' },
    { geography: 'US', region: 'South Central US', identifier: 'southcentralus' },
    { geography: 'US', region: 'West Central US', identifier: 'westcentralus' },
    { geography: 'US', region: 'West US', identifier: 'westus' },
    { geography: 'US', region: 'West US 2', identifier: 'westus2' },
    { geography: 'US', region: 'West US 3', identifier: 'westus3' },
];

export const customStyles = {
    menu: (provided) => ({
        ...provided,
        width: 'fit-content',
        backgroundColor: 'rgba(11, 11, 11, 0.636)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        border: '2px solid gray',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'white'
    }),
    container: (provided) => ({
        ...provided,
        color: 'white'
    }),
    control: (provided) => ({
        ...provided,
        width: 'fit-content',
        backgroundColor: 'rgba(18, 18, 18, 0.737)',
        boxShadow: '0px 0px 10px 0px rgba(57, 57, 57, 0.737)',
        backdropFilter: 'blur(11px)',
        scrollbehavior: 'smooth',
        color: 'black',
        border: '2px solid gray',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: 'rgba(11, 11, 11, 0.636)',
        color: 'white',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'white'
    }),
};

export const customUserStyles = {
    menu: (provided) => ({
        ...provided,
        width: 'fit-content',
        backgroundColor: 'rgba(11, 11, 11, 0.636)',
        backdropFilter: 'blur(10px)',
        border: '2px solid gray',
        color: 'white'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'white'
    }),
    container: (provided) => ({
        ...provided,
        color: 'white'
    }),
    control: (provided) => ({
        ...provided,
        width: 'fit-content',
        backgroundColor: 'rgba(18, 18, 18, 0.737)',
        boxShadow: '0px 0px 10px 0px rgba(57, 57, 57, 0.737)',
        backdropFilter: 'blur(11px)',
        scrollbehavior: 'smooth',
        color: 'black',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: 'rgba(11, 11, 11, 0.636)',
        color: 'white',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'gray'
    }),
};