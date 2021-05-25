import React from "react"
import renderer from "react-test-renderer"
import AffiliateLink from "../AffiliateLink"

describe(`AffilateLink`, () => {
  it(`Vendor url only`, () => {
    const mockDevice = {
      Device: `MockDevice`,
      Brand: `MockBrand`,
      Detail: `https://host1/`,
    }
    const render = renderer.create(<AffiliateLink device={mockDevice} />)
    expect(render.toJSON()).toMatchSnapshot()
  })
  it(`No vendor url`, () => {
    const mockDevice = { Device: `MockDevice`, Brand: `MockBrand` }
    const render = renderer.create(<AffiliateLink device={mockDevice} />)
    expect(render.toJSON()).toMatchSnapshot()
  })
  it(`Vendor url + Affiliate link`, () => {
    const mockDevice = {
      Device: `MockDevice`,
      Brand: `MockBrand`,
      Detail: `https://host1/`,
      Affiliate_Link: `https://host2/`,
    }
    const tree = renderer.create(<AffiliateLink device={mockDevice} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it(`Affiliate link only`, () => {
    const mockDevice = {
      Device: `MockDevice`,
      Brand: `MockBrand`,
      Affiliate_Link: `https://host2/`,
    }
    const render = renderer.create(<AffiliateLink device={mockDevice} />)
    expect(render.toJSON()).toMatchSnapshot()
  })
})
